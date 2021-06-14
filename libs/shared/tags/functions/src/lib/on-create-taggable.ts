import * as functions from 'firebase-functions';
import { DataAccessor, getEnv } from '@ygg/shared/infra/core';
import { Taggable, TagRecord } from '@ygg/shared/tags/core';
import { wrapError } from '@ygg/shared/infra/error';
import { uniq } from 'lodash';

const firebaseEnv = getEnv('firebase');

export function generateOnCreateFunction(
  subjectCollection: string,
  dataAccessor: DataAccessor
) {
  return functions
    .region(firebaseEnv.region)
    .firestore.document(`${subjectCollection}/{id}`)
    .onCreate(
      async (
        snapshot: functions.firestore.QueryDocumentSnapshot,
        context: functions.EventContext
      ) => {
        try {
          const taggable: Taggable = new Taggable().fromJSON(snapshot.data());
          const tagRecordCollection = TagRecord.tagsCollectionName(
            subjectCollection
          );
          let tagRecord: TagRecord;
          for (const tag of taggable.tags.getTags()) {
            tagRecord = null;
            const tagRecordsExist = await dataAccessor.has(
              tagRecordCollection,
              tag
            );
            if (tagRecordsExist) {
              const data = await dataAccessor.load(tagRecordCollection, tag);
              if (data) {
                tagRecord = TagRecord.deserialize(data);
              }
            }
            if (!tagRecord) {
              tagRecord = new TagRecord({
                id: tag,
                subjectCollection
              });
            }
            tagRecord.subjectIds.push(context.params.id);
            if (tagRecord) {
              tagRecord.subjectIds = uniq(tagRecord.subjectIds);
              await dataAccessor.save(
                tagRecordCollection,
                tagRecord.id,
                TagRecord.serialize(tagRecord)
              );
            }
          }
          return Promise.resolve();
        } catch (error) {
          const wrpErr = wrapError(
            error,
            `Failed to execute tags function on create ${subjectCollection}`
          );
          console.error(wrpErr.message);
          return Promise.reject(wrpErr);
        }
      }
    );
}
