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
            const relations: RelationRecord[] = theThing
              .getAllRelations()
              .map(r => r.toRelationRecord());
            for (const relation of relations) {
              await relationAccessor.delete(relation.id);
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
