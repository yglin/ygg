import { Tag } from "../tag";
import { Taggable } from "../taggable";
import { Tagging } from "../tagging";
import * as admin from 'firebase-admin';
import { Tags } from '../tags';

export async function tag(tags: Tags, taggable: Taggable, collection) {
  const promises: Promise<any>[] = [];
  for (const _tag of tags.toTagsArray()) {
    promises.push(tagOne(_tag, taggable, collection));
  }
  return Promise.all(promises);
}

export async function untag(tags: Tags, taggable: Taggable, collection) {
  const promises: Promise<any>[] = [];
  for (const _tag of tags.toTagsArray()) {
    promises.push(untagOne(_tag, taggable, collection));
  }
  return Promise.all(promises);
}

async function incrementCount(_tag: Tag) {
  console.log(`Increment tagging count of tag ${_tag.id}`);
  const increment = admin.firestore.FieldValue.increment(1);
  return admin.firestore().collection(Tag.collectionName).doc(_tag.id).set({ taggingCount: increment }, { merge: true });
}

async function tagOne(_tag: Tag, taggable: Taggable, collection: string) {
  const tagging: Tagging = new Tagging(_tag, taggable, collection);
  console.log(`Tagging "${tagging.taggableCollection} ${tagging.taggableId}" with tag "${tagging.tagId}"`);
  await admin.firestore().collection(Tagging.collectionName).doc(tagging.id).set(tagging.toJSON());
  return incrementCount(_tag);
}

async function decrementCount(_tag: Tag) {
  console.log(`Decrement tagging count of tag ${_tag.id}`);
  const decrement = admin.firestore.FieldValue.increment(-1);
  return admin.firestore().collection(Tag.collectionName).doc(_tag.id).set({ taggingCount: decrement }, { merge: true });
}

async function untagOne(_tag: Tag, taggable: Taggable, collection: string) {
  const tagging: Tagging = new Tagging(_tag, taggable, collection);
  console.log(`Un-Tagging "${tagging.taggableCollection} ${tagging.taggableId}" with tag "${tagging.tagId}"`);
  await admin.firestore().collection(Tagging.collectionName).doc(tagging.id).delete();
  return decrementCount(_tag);
}

