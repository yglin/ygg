import * as functions from 'firebase-functions';
import { camelCase, upperFirst, uniq, forIn } from 'lodash';
import {
  TheThingImitation,
  TheThing,
  TheThingRelation,
  RelationRecord,
  LocationRecord
} from '@ygg/the-thing/core';
import { relationAccessor, locationRecordAccessor, tagsAccessor } from '../global';
import { User } from '@ygg/shared/user/core';
import { OmniTypes, Location } from '@ygg/shared/omni-types/core';
import { getEnv } from '@ygg/shared/infra/core';
import { Tag, Tags } from '@ygg/tags/core';

const firebaseEnv = getEnv('firebase');

export function generateOnCreateFunctions(imitations: TheThingImitation[]) {
  const onCreateFunctions = {};
  const collections = uniq(imitations.map(im => im.collection));
  for (const collection of collections) {
    onCreateFunctions[
      `onCreateTheThing${upperFirst(camelCase(collection))}`
    ] = functions.region(firebaseEnv.region).firestore
      .document(`${collection}/{id}`)
      .onCreate(
        async (
          snapshot: functions.firestore.QueryDocumentSnapshot,
          context: functions.EventContext
        ) => {
          try {
            // console.debug(`On Create TheThing ${context.params.id}`);
            const theThing: TheThing = new TheThing().fromJSON(snapshot.data());

            // Save relation records subject to the new TheThing
            // console.log(`Save relations of TheThing ${theThing.id}`);
            for (const relation of theThing.generateRelationRecords()) {
              // console.log(`Save relation record ${relation.id}`);
              // console.log(relation);
              await relationAccessor.save(relation);
            }

            // Save role-user relations subject to the new TheThing
            for (const role in theThing.users) {
              if (Object.prototype.hasOwnProperty.call(theThing.users, role)) {
                const userIds = theThing.users[role];
                for (const userId of userIds) {
                  const relationRecord: RelationRecord = new RelationRecord({
                    subjectCollection: theThing.collection,
                    subjectId: theThing.id,
                    objectCollection: User.collection,
                    objectId: userId,
                    objectRole: role
                  });
                  await relationAccessor.save(relationRecord);
                }
              }
            }

            // Extract and save location records
            const locationRecords: LocationRecord[] = [];
            for (const cellId in theThing.cells) {
              if (
                Object.prototype.hasOwnProperty.call(theThing.cells, cellId)
              ) {
                const cell = theThing.cells[cellId];
                const location: Location = cell.value;
                if (
                  cell.type === OmniTypes.location.id &&
                  Location.isLocation(cell.value)
                ) {
                  locationRecords.push(
                    new LocationRecord({
                      latitude: location.geoPoint.latitude,
                      longitude: location.geoPoint.longitude,
                      address: location.address,
                      objectCollection: theThing.collection,
                      objectId: theThing.id
                    })
                  );
                }
              }
            }
            for (const locationRecord of locationRecords) {
              await locationRecordAccessor.save(locationRecord);
            }

            // Accumulate tag records
            const tagNames: string[] = Tags.isTags(theThing.tags) ? theThing.tags.tags : [];
            // console.debug('Found new tags');
            // console.debug(tagNames);
            for (const tagName of tagNames) {
              const tagExist = await tagsAccessor.has(tagName);
              if (tagExist) {
                tagsAccessor.increment(tagName, 'popularity');
              } else {
                tagsAccessor.save(new Tag(tagName));
              }
            }

            return Promise.resolve();
          } catch (error) {
            console.error(error.message);
            return Promise.reject(error);
          }
        }
      );
  }
  return onCreateFunctions;
}
