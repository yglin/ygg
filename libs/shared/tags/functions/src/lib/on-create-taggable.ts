import * as functions from 'firebase-functions';
import { DataAccessor, getEnv } from '@ygg/shared/infra/core';
import { Taggable, TagRecords } from '@ygg/shared/tags/core';
import { wrapError } from '@ygg/shared/infra/error';

const firebaseEnv = getEnv('firebase');

export function generateOnCreateFunction(
  collection: string,
  dataAccessor: DataAccessor
) {
  return functions
    .region(firebaseEnv.region)
    .firestore.document(`${collection}/{id}`)
    .onCreate(
      async (
        snapshot: functions.firestore.QueryDocumentSnapshot,
        context: functions.EventContext
      ) => {
        try {
          const taggable: Taggable = new Taggable().fromJSON(snapshot.data());
          for (const tag of taggable.tags.getTags()) {
            const tagRecords: TagRecords = new TagRecords(tag);
            const tagRecordsExist = await dataAccessor.has(
              TagRecords.collection,
              tag
            );
            if (tagRecordsExist) {
              const data = await dataAccessor.load(TagRecords.collection, tag);
              if (data) {
                tagRecords.fromJSON(data);
              }
            }
            tagRecords.addRecord(collection, context.params.id);
            await dataAccessor.save(
              TagRecords.collection,
              tagRecords.id,
              tagRecords.toJSON()
            );
          }
          return Promise.resolve();
        } catch (error) {
          console.error(error.message);
          return Promise.reject(error);
        }
      }
    );
}
