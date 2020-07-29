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
  RelationRecord
} from '@ygg/the-thing/core';
import { relationFactory, relationAccessor } from '../global';

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
