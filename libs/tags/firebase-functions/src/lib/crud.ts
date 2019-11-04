import { Tag, Tags } from '@ygg/tags/core';
import * as admin from 'firebase-admin';
import { WriteResult } from '@google-cloud/firestore';

export async function upsertTags(tags: Tags) {
  const promises: Promise<WriteResult | void>[] = [];
  for (const tag of tags.toTagsArray()) {
    promises.push(upsertTag(tag));
  }
  return Promise.all(promises);
}

export function deleteTags(tags: Tags) {
  const promises: Promise<WriteResult | void>[] = [];
  for (const tag of tags.toTagsArray()) {
    promises.push(deleteTag(tag));
  }
  return Promise.all(promises);  
}

async function upsertTag(tag: Tag) {
  console.log(`Upsert tag: ${tag.id}`);
  tag = new Tag(tag);
  const tagSnapshot = await admin.firestore().collection(Tag.collectionName).doc(tag.id).get();
  if (!tagSnapshot.exists) {
    const tagData = tag.toJSON();
    tagData.taggingCount = 0;
    return await admin.firestore().collection(Tag.collectionName).doc(tag.id).set(tagData);
  } else {
    return Promise.resolve();
  }
}

async function deleteTag(tag: Tag) {
  console.log(`Delete tag: ${tag.id}`);
  return await admin.firestore().collection(Tag.collectionName).doc(tag.id).delete();
}

