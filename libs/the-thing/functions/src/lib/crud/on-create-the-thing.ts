import * as functions from 'firebase-functions';
import { camelCase, upperFirst, uniq, forIn } from 'lodash';
import {
  TheThingImitation,
  TheThing,
  TheThingRelation,
  RelationRecord
} from '@ygg/the-thing/core';
import { relationAccessor } from '../global';
import { User } from '@ygg/shared/user/core';

export function generateOnCreateFunctions(imitations: TheThingImitation[]) {
  const onCreateFunctions = {};
  const collections = uniq(imitations.map(im => im.collection));
  for (const collection of collections) {
    onCreateFunctions[
      `onCreateTheThing${upperFirst(camelCase(collection))}`
    ] = functions.firestore
      .document(`${collection}/{id}`)
      .onCreate(
        async (
          snapshot: functions.firestore.QueryDocumentSnapshot,
          context: functions.EventContext
        ) => {
          try {
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
