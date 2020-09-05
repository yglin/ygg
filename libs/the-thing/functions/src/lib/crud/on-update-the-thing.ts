import * as functions from 'firebase-functions';
import {
  camelCase,
  upperFirst,
  uniq,
  difference,
  differenceWith,
  find,
  filter
} from 'lodash';
import {
  TheThingImitation,
  TheThing,
  TheThingRelation,
  RelationRecord,
  LocationRecord,
  TheThingCell
} from '@ygg/the-thing/core';
import {
  relationFactory,
  relationAccessor,
  locationRecordAccessor
} from '../global';
import { User } from '@ygg/shared/user/core';
import { OmniTypes, Location } from '@ygg/shared/omni-types/core';

export function generateOnUpdateFunctions(imitations: TheThingImitation[]) {
  const onUpdateFunctions = {};
  const collections = uniq(imitations.map(im => im.collection));
  for (const collection of collections) {
    onUpdateFunctions[
      `onUpdateTheThing${upperFirst(camelCase(collection))}`
    ] = functions.firestore
      .document(`${collection}/{id}`)
      .onUpdate(
        async (
          snapshot: functions.Change<functions.firestore.QueryDocumentSnapshot>,
          context: functions.EventContext
        ) => {
          try {
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

            // Sync location records;
            const locationCellsBefore = filter(
              theThingBefore.cells,
              cell => cell.type === OmniTypes.location.id
            );
            const locationCellsAfter = filter(
              theThingAfter.cells,
              cell => cell.type === OmniTypes.location.id
            );

            const isLocationCellEqual = (
              cellA: TheThingCell,
              cellB: TheThingCell
            ): boolean => {
              return (
                Location.isLocation(cellA.value) &&
                Location.isLocation(cellB.value) &&
                cellA.value.geoPoint.isEqual(cellB.value.geoPoint)
              );
            };
            const deleteLocationRecordIds: string[] = differenceWith(
              locationCellsBefore,
              locationCellsAfter,
              isLocationCellEqual
            ).map(cell => {
              const location: Location = cell.value;
              return LocationRecord.constructId(
                location.geoPoint.latitude,
                location.geoPoint.longitude,
                theThingBefore.collection,
                theThingBefore.id
              );
            });

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

            for (const deleteId of deleteLocationRecordIds) {
              await locationRecordAccessor.delete(deleteId);
            }
            for (const locationRecord of newLocationRecords) {
              await locationRecordAccessor.save(locationRecord);
            }

            return Promise.resolve();
          } catch (error) {
            console.error(error.message);
            return Promise.reject(error);
          }
        }
      );
  }
  return onUpdateFunctions;
}
