import { v4 as uuid } from 'uuid';
import { range, random } from 'lodash';
import * as functionsTest from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { Tag, Tags, Taggable, Tagging } from "@ygg/tags/core";
import { FeaturesList } from 'firebase-functions-test/lib/features';
import * as firebaseConfig from '@ygg/firebase/project-config.develop.json';
import { createOnWriteTrigger } from "./on-write-taggable";
// import serviceAccount from '@ygg/firebase/serviceAccount.json';

// you should pass projectConfig and path to serviceAccountKey like this
// path.resolve defaults to directory where you're executing test command
// for my case, it's functions directory

class StubTaggable implements Taggable {
  id: string;
  tags: Tags;

  static forge(): StubTaggable {
    const forged = new StubTaggable();
    forged.id = uuid();
    forged.tags = Tags.forge();
    return forged;
  }

  toJSON(): any {
    return {
      id: this.id,
      tags: this.tags.toJSON()
    }
  }
}


describe('Tags modification on write to Taggable', () => {
  // let stubAdmin;
  let testEnv: FeaturesList;
  const stubCollection = 'garbages';
  let wrappedFunction;

  async function createStubTaggable(stubTaggable: StubTaggable, tags: Tag[]) {
    const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot(
      {},
      `${stubCollection}/${stubTaggable.id}`
    );
    stubTaggable.tags = new Tags(tags);
    const afterSnapshot = testEnv.firestore.makeDocumentSnapshot(
      stubTaggable.toJSON(),
      `${stubCollection}/${stubTaggable.id}`
    );
    const change = testEnv.makeChange(beforeSnapshot, afterSnapshot);
    return await wrappedFunction(change);
  }

  async function updateStubTaggable(stubTaggable: StubTaggable, newTags: Tag[]) {
    const beforeSnapshot = testEnv.firestore.makeDocumentSnapshot(
      stubTaggable.toJSON(),
      `${stubCollection}/${stubTaggable.id}`
    );
    stubTaggable.tags = new Tags(newTags);
    const afterSnapshot = testEnv.firestore.makeDocumentSnapshot(
      stubTaggable.toJSON(),
      `${stubCollection}/${stubTaggable.id}`
    );
    const change = testEnv.makeChange(beforeSnapshot, afterSnapshot);
    return await wrappedFunction(change);
  }

  async function expectTags(tags: Tag[], flag: boolean) {
    for (const tag of tags) {
      const query = admin
        .firestore()
        .collection('tags')
        .where('name', '==', tag.name);
      const resultSnapshots = await query.get();
      expect(resultSnapshots.empty).toBe(!flag);
    }
    return Promise.resolve();
  }

  async function expectTagged(
    tag: Tag,
    taggable: Taggable,
    collection: string,
    flag: boolean
  ) {
    const tagging = new Tagging(tag, taggable, collection);
    const taggingDoc = await admin
      .firestore()
      .collection('taggings')
      .doc(tagging.id)
      .get();
    expect(taggingDoc.exists).toBe(flag);
    return Promise.resolve();
  }

  async function expectTaggingCount(tag: Tag, count: number) {
    console.log(`Expect taggingCount of tag ${tag.id} = ${count}`);
    const query = admin.firestore().collection('taggings').where('tagId', '==', tag.id);
    const resultSnapshots = await query.get();
    const taggingsCount = resultSnapshots.size;
    expect(taggingsCount).toBe(count);
    return Promise.resolve();
  }

  async function cleanUpTestData(taggables: Taggable[], tags: Tag[], collection: string) {
    for (const taggable of taggables) {
      console.log(`CleanUp: Remove ${stubCollection} ${taggable.id}`);
      await admin
        .firestore()
        .collection(`${stubCollection}`)
        .doc(taggable.id)
        .delete();
    }
    for (const tag of tags) {
      console.log(`CleanUp: Remove tag ${tag.id}`);
      await admin
        .firestore()
        .collection('tags')
        .doc(tag.id)
        .delete();
    }
    for (const taggable of taggables) {
      for (const tag of tags) {
        const tagging = new Tagging(tag, taggable, collection);
        console.log(`CleanUp: Remove tagging ${tagging.id}`);
        await admin
          .firestore()
          .collection('taggings')
          .doc(tagging.id)
          .delete();
      }
    }
    return Promise.resolve();
  }

  beforeAll(async done => {
    testEnv = functionsTest(
      firebaseConfig,
      path.resolve('.firebase/serviceAccount.json')
    );
    wrappedFunction = testEnv.wrap(createOnWriteTrigger(stubCollection));
    admin.initializeApp();
    jest.setTimeout(10000);
    done();
  });

  afterAll(async done => {
    // stubAdmin.mockRestore();
    testEnv.cleanup();
    done();
  });

  // it('admin should work', async done => {
  //   await admin.firestore().doc('garbages/ggyy').set({ name: 'ggyy' });
  //   const ggyy = await admin.firestore().doc('garbages/ggyy').get();
  //   // console.log(ggyy);
  //   expect(ggyy.exists).toBe(true);
  //   await admin.firestore().doc('garbages/ggyy').delete();
  //   done();
  // });

  it('Should add new tags to tags colletion on stubTaggable created', async done => {
    const testStubTaggable = StubTaggable.forge();
    const testTags1 = range(random(2, 5)).map(() => Tag.forge());
    await createStubTaggable(testStubTaggable, testTags1);
    await expectTags(testTags1, true);
    await cleanUpTestData([testStubTaggable], testTags1, stubCollection);
    done();
  });

  it('Should add new tags to tags colletion on stubTaggable update', async done => {
    const testStubTaggable = StubTaggable.forge();
    const testTags1 = range(random(2, 5)).map(() => Tag.forge());
    const testTags2 = range(random(2, 5)).map(() => Tag.forge());
    await createStubTaggable(testStubTaggable, testTags1);
    await updateStubTaggable(testStubTaggable, testTags2);
    await expectTags(testTags2, true);
    await cleanUpTestData([testStubTaggable], testTags1.concat(testTags2), stubCollection);
    done();
  });

  it('Should tag stubTaggable on stubTaggable created', async done => {
    const testStubTaggable = StubTaggable.forge();
    const testTags1 = range(random(2, 5)).map(() => Tag.forge());
    await createStubTaggable(testStubTaggable, testTags1);
    for (const tag of testTags1) {
      await expectTagged(tag, testStubTaggable, stubCollection, true);
    }
    await cleanUpTestData([testStubTaggable], testTags1, stubCollection);
    done();
  });

  it('Should untag old tags and tag new tags, on stubTaggable updated', async done => {
    const testStubTaggable = StubTaggable.forge();
    const testTags1 = range(random(2, 5)).map(() => Tag.forge());
    const testTags2 = range(random(2, 5)).map(() => Tag.forge());
    await createStubTaggable(testStubTaggable, testTags1);
    await updateStubTaggable(testStubTaggable, testTags2);
    for (const tag of testTags1) {
      await expectTagged(tag, testStubTaggable, stubCollection, false);
    }
    for (const tag of testTags2) {
      await expectTagged(tag, testStubTaggable, stubCollection, true);
    }
    await cleanUpTestData([testStubTaggable], testTags1.concat(testTags2), stubCollection);
    done();
  });

  it('Should aggregate correct tagging count when stubTaggable changed', async done => {
    const testTag = Tag.forge();
    const testStubTaggable1 = StubTaggable.forge();
    const testStubTaggable2 = StubTaggable.forge();
    await createStubTaggable(testStubTaggable1, [testTag]);
    await expectTaggingCount(testTag, 1);
    await createStubTaggable(testStubTaggable2, [testTag]);
    await expectTaggingCount(testTag, 2);
    await updateStubTaggable(testStubTaggable2, []);
    await expectTaggingCount(testTag, 1);
    await updateStubTaggable(testStubTaggable1, []);
    await expectTaggingCount(testTag, 0);
    done();
  });
  
});
