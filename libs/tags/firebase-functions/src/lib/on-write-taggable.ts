import { isEmpty } from 'lodash';
import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
// import { Play } from 'libs/taggablewhat/taggable/src/lib/taggable/taggable';
import { Taggable, Tags } from '@ygg/tags/core';
import { upsertTags } from './crud';
import { tag, untag } from './tagging';

// for (const taggableConfig of projectConfig.taggables) {
//   exports[`onWrite${taggableConfig.name}`] = createOnWriteTrigger(taggableConfig.collection);
// }

function toTaggable(data: any): Taggable {
  const tags = new Tags(data.tags);
  return { id: data.id, tags: tags };
}

export function createOnWriteTrigger(
  collection: string,
  options: any = {}
): functions.CloudFunction<
  functions.Change<FirebaseFirestore.DocumentSnapshot>
> {
  options.region = options.region || 'us-central1';
  return functions.region(options.region).firestore
    .document(`${collection}/{id}`)
    .onWrite(
      async (
        change: functions.Change<FirebaseFirestore.DocumentSnapshot>,
        context: functions.EventContext
      ) => {
        const beforeData: Taggable = change.before.exists
          ? toTaggable(change.before.data())
          : null;
        const afterData: Taggable = change.after.exists
          ? toTaggable(change.after.data())
          : null;
        context.params.collection = collection;
        return await onWriteTaggable(beforeData, afterData, context);
      }
    );
}

async function onWriteTaggable(beforeData: Taggable, afterData: Taggable, context: functions.EventContext) {
  if (beforeData && afterData) {
    return await onUpdate(beforeData, afterData, context);
  } else if (afterData) {
    return await onCreate(afterData, context);
  } else if (beforeData) {
    return await onDelete(beforeData, context);
  }
}

async function onCreate(taggable: Taggable, context: functions.EventContext) {
  console.log(`On create taggable ${taggable.id}`);
  if (!isEmpty(taggable.tags)) {
    await upsertTags(taggable.tags);
    return await tag(taggable.tags, taggable, context.params.collection);
  }
}

async function onUpdate(beforeData: Taggable, afterData: Taggable, context: functions.EventContext) {
  console.log(`On update taggable ${beforeData.id}`);
  if (!isEmpty(beforeData.tags)) {
    await untag(beforeData.tags, beforeData, context.params.collection);
  }
  if (!isEmpty(afterData.tags)) {
    await upsertTags(afterData.tags);
    await tag(afterData.tags, afterData, context.params.collection);
  }
  return Promise.resolve();
}

async function onDelete(taggable: Taggable, context: functions.EventContext) {
  console.log(`On delete taggable ${taggable.id}`);
  if (!isEmpty(taggable.tags)) {
    await untag(taggable.tags, taggable, context.params.collection);
  }
  return Promise.resolve();
}
