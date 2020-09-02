import * as functions from 'firebase-functions';
import {
  camelCase,
  upperFirst,
  uniq,
  difference,
  differenceWith
} from 'lodash';
import {
  TheThingImitation,
  TheThing,
  TheThingRelation,
  RelationRecord,
  RelationAccessor
} from '@ygg/the-thing/core';
import { relationFactory, relationAccessor } from '../global';
import { User } from '@ygg/shared/user/core';

export function generateOnDeleteFunctions(imitations: TheThingImitation[]) {
  const onDeleteFunctions = {};
  const collections = uniq(imitations.map(im => im.collection));
  for (const collection of collections) {
    onDeleteFunctions[
      `onDeleteTheThing${upperFirst(camelCase(collection))}`
    ] = functions.firestore
      .document(`${collection}/{id}`)
      .onDelete(
        async (
          snapshot: functions.firestore.QueryDocumentSnapshot,
          context: functions.EventContext
        ) => {
          try {
            const theThing = new TheThing().fromJSON(snapshot.data());

            // Delete relations subject to deleted TheThing
            const relations: RelationRecord[] = theThing
              .getAllRelations()
              .map(r => r.toRelationRecord());
            for (const relation of relations) {
              await relationAccessor.delete(relation.id);
            }

            // Delete role-user relations subject to deleted TheThing
            for (const role in theThing.users) {
              if (Object.prototype.hasOwnProperty.call(theThing.users, role)) {
                const userIds = theThing.users[role];
                for (const userId of userIds) {
                  await relationAccessor.delete(
                    RelationRecord.constructId(theThing.id, role, userId)
                  );
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
  return onDeleteFunctions;
}
