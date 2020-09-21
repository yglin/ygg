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
  RelationAccessor,
  LocationRecord
} from '@ygg/the-thing/core';
import {
  relationFactory,
  relationAccessor,
  locationRecordAccessor
} from '../global';
import { User } from '@ygg/shared/user/core';
import { getEnv, Query } from '@ygg/shared/infra/core';

const firebaseEnv = getEnv('firebase');

export function generateOnDeleteFunctions(imitations: TheThingImitation[]) {
  const onDeleteFunctions = {};
  const collections = uniq(imitations.map(im => im.collection));
  for (const collection of collections) {
    onDeleteFunctions[
      `onDeleteTheThing${upperFirst(camelCase(collection))}`
    ] = functions.region(firebaseEnv.region).firestore
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

            // Delete location records
            const queries: Query[] = [
              new Query('objectCollection', '==', theThing.collection),
              new Query('objectId', '==', theThing.id)
            ];
            const deleteLocationRecords: LocationRecord[] = await locationRecordAccessor.find(
              queries
            );

            for (const deleteRecord of deleteLocationRecords) {
              await locationRecordAccessor.delete(deleteRecord.id);
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
