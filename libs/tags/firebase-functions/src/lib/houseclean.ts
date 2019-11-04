import { Tag, Tags } from '@ygg/tags/core';
import validator from 'validator';
import * as admin from 'firebase-admin';
import { deleteTags } from './crud';

export async function clearTags() {
  const tagsCollection = admin.firestore().collection(Tag.collectionName);
  const querySnapshot = await tagsCollection.get();
  const toBeDeletedTags: Tags = new Tags();
  querySnapshot.forEach(tagDoc => {
    // tag with uuid is only for test, should be clear out
    if (validator.isUUID(tagDoc.id)) {
      toBeDeletedTags.push(tagDoc.id);
    }
  });
  return deleteTags(toBeDeletedTags);
}
