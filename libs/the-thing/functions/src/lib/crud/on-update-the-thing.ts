import { getEnv } from '@ygg/shared/infra/core';
import { Location, OmniTypes } from '@ygg/shared/omni-types/core';
import { User } from '@ygg/shared/user/core';
import { Tag, Tags } from '@ygg/tags/core';
import {
  LocationRecord,
  RelationRecord,
  TheThing,
  TheThingCell,
  TheThingImitation
} from '@ygg/the-thing/core';
import * as functions from 'firebase-functions';
import {
  camelCase,
  difference,
  differenceWith,
  filter,
  uniq,
  upperFirst
} from 'lodash';
import { locationRecordAccessor, relationAccessor, tagsAccessor } from '../global';

const firebaseEnv = getEnv('firebase');

function isLocationCellEqual(
  cellA: TheThingCell,
  cellB: TheThingCell
): boolean {
  // console.log(cellA.value);
  // console.log(cellB.value);
  return (
    Location.isLocation(cellA.value) &&
    Location.isLocation(cellB.value) &&
    cellA.value.geoPoint.isEqual(cellB.value.geoPoint)
  );
}

export function generateOnUpdateFunctions(imitations: TheThingImitation[]) {
  const onUpdateFunctions = {};
  const collections = uniq(imitations.map(im => im.collection));
  for (const collection of collections) {
    onUpdateFunctions[
      `onUpdateTheThing${upperFirst(camelCase(collection))}`
    ] = functions
      .region(firebaseEnv.region)
      .firestore.document(`${collection}/{id}`)
      .onUpdate(
        async (
          snapshot: functions.Change<functions.firestore.QueryDocumentSnapshot>,
          context: functions.EventContext
        ) => {
          try {
            console.log(`On update TheThing ${context.params.id}`);
            const theThingBefore = new TheThing().fromJSON(
              snapshot.before.data()
            );
            const theThingAfter = new TheThing().fromJSON(
              snapshot.after.data()
            );

            // Sync relations subject to updated TheThing
            const relationsBefore = theThingBefore
              .getAllRelations()
              .map(r => r.toRelationRecord());
            const relationsAfter = theThingAfter
              .getAllRelations()
              .map(r => r.toRelationRecord());
            const deleteRelationIds: string[] = difference(
              relationsBefore.map(r => r.id),
              relationsAfter.map(r => r.id)
            );
            for (const relationId of deleteRelationIds) {
              await relationAccessor.delete(relationId);
            }

            const upsertRelations: RelationRecord[] = differenceWith(
              relationsAfter,
              relationsBefore,
              (ra: RelationRecord, rb: RelationRecord) => {
                return ra && rb && ra.isEqual(rb);
              }
            );
            for (const relation of upsertRelations) {
              await relationAccessor.save(relation);
            }

            // Sync role-user relations subject to updated TheThing
            const deleteUserRelationIds: string[] = [];
            const newUserRelations: RelationRecord[] = [];

            // console.log(theThingBefore.users);
            // console.log(theThingAfter.users);
            for (const role in theThingBefore.users) {
              if (
                Object.prototype.hasOwnProperty.call(theThingBefore.users, role)
              ) {
                const userIds = theThingBefore.users[role];
                for (const userId of userIds) {
                  if (!theThingAfter.hasUserOfRole(role, userId)) {
                    deleteUserRelationIds.push(
                      RelationRecord.constructId(theThingAfter.id, role, userId)
                    );
                  }
                }
              }
            }

            for (const role in theThingAfter.users) {
              if (
                Object.prototype.hasOwnProperty.call(theThingAfter.users, role)
              ) {
                const userIds = theThingAfter.users[role];
                for (const userId of userIds) {
                  if (!theThingBefore.hasUserOfRole(role, userId)) {
                    newUserRelations.push(
                      new RelationRecord({
                        subjectCollection: theThingAfter.collection,
                        subjectId: theThingAfter.id,
                        objectCollection: User.collection,
                        objectId: userId,
                        objectRole: role
                      })
                    );
                  }
                }
              }
            }

            for (const deleteId of deleteUserRelationIds) {
              console.log(`Delete relation ${deleteId}`);
              await relationAccessor.delete(deleteId);
            }
            for (const newRelation of newUserRelations) {
              console.log(`Upsert new relation ${newRelation.id}`);
              await relationAccessor.save(newRelation);
            }

            // console.log('幹');
            // Sync location records;
            const locationCellsBefore = filter(
              theThingBefore.cells,
              cell =>
                cell.type === OmniTypes.location.id &&
                Location.isLocation(cell.value)
            );
            const locationCellsAfter = filter(
              theThingAfter.cells,
              cell =>
                cell.type === OmniTypes.location.id &&
                Location.isLocation(cell.value)
            );

            // console.log('林');
            // console.log(locationCellsBefore);
            // console.log(locationCellsAfter);
            const deleteLocationCells = differenceWith(
              locationCellsBefore,
              locationCellsAfter,
              isLocationCellEqual
            );
            // console.log(deleteLocationCells);
            const deleteLocationRecordIds: string[] = deleteLocationCells.map(
              cell => {
                const location: Location = cell.value;
                // console.log(location);
                return LocationRecord.constructId(
                  location.geoPoint.latitude,
                  location.geoPoint.longitude,
                  theThingBefore.collection,
                  theThingBefore.id
                );
              }
            );
            // console.log(deleteLocationRecordIds);

            // console.log('老');
            const newLocationRecords: LocationRecord[] = differenceWith(
              locationCellsAfter,
              locationCellsBefore,
              isLocationCellEqual
            ).map(cell => {
              const location: Location = cell.value;
              return new LocationRecord({
                latitude: location.geoPoint.latitude,
                longitude: location.geoPoint.longitude,
                address: location.address,
                objectCollection: theThingAfter.collection,
                objectId: theThingAfter.id
              });
            });

            // console.log('師');
            for (const deleteId of deleteLocationRecordIds) {
              console.log(`Delete LocationRecord ${deleteId}`);
              await locationRecordAccessor.delete(deleteId);
            }

            // console.log('勒');
            for (const locationRecord of newLocationRecords) {
              console.log(`Upsert locationRecord ${locationRecord.id}`);
              await locationRecordAccessor.save(locationRecord);
            }

            // Sync tags popularity
            const tagNamesBefore: string[] = Tags.isTags(theThingBefore.tags) ? theThingBefore.tags.tags : [];
            const tagNamesAfter: string[] = Tags.isTags(theThingAfter.tags) ? theThingAfter.tags.tags : [];
            const tagNamesAdd: string[] = difference(tagNamesAfter, tagNamesBefore);
            const tagNamesRemove: string[] = difference(tagNamesBefore, tagNamesAfter);

            for (const tagName of tagNamesAdd) {
              const tagExist = await tagsAccessor.has(tagName);
              if (tagExist) {
                tagsAccessor.increment(tagName, 'popularity');
              } else {
                tagsAccessor.save(new Tag(tagName));
              }
            }

            for (const tagName of tagNamesRemove) {
              const tagExist = await tagsAccessor.has(tagName);
              if (tagExist) {
                tagsAccessor.decrement(tagName, 'popularity');
              }
            }

            return Promise.resolve();
          } catch (error) {
            const wrapError = new Error(
              `Failed to run functions on update ${collection}/${context.params.id}.\n${error.message}`
            );
            return Promise.reject(wrapError);
          }
        }
      );
  }
  return onUpdateFunctions;
}
