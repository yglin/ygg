import { Box, Treasure } from '@ygg/ourbox/core';
import { TreasureMapPageObjectCypress } from '@ygg/ourbox/test';
import { Location, LocationRecord } from '@ygg/shared/geography/core';
import { generateID } from '@ygg/shared/infra/core';
import { TagRecord, Tags } from '@ygg/shared/tags/core';
import { theMockDatabase } from '@ygg/shared/test/cypress';
import { User } from '@ygg/shared/user/core';
import { testUsers } from '@ygg/shared/user/test';
import { RelationBoxTreasure } from 'libs/ourbox/core/src/lib/box/box-treasure';
import { range, sample, sampleSize, values } from 'lodash';
import { myBeforeAll } from '../before-all';
import { gotoMapNavigatorPage } from './map';

describe('Search and navigate in treasure map', () => {
  const treasureMapPO = new TreasureMapPageObjectCypress();

  const me = testUsers[1];
  const topCount = 20;
  const total = topCount * 3;
  const tagsPool = range(total).map(() => generateID());
  const boxLocationRecords: LocationRecord[] = [];

  const mapCenter = Location.forge();
  const boxesTotal = 10;
  const boxes = range(boxesTotal).map(() => {
    const box = Box.forge({
      ownerId: me.id,
      public: true,
      location: new Location(mapCenter)
    });
    box.location.geoPoint.randomMove(1500);
    boxLocationRecords.push(
      new LocationRecord({
        latitude: box.location.geoPoint.latitude,
        longitude: box.location.geoPoint.longitude,
        address: box.location.address,
        objectCollection: Box.collection,
        objectId: box.id
      })
    );
    return box;
  });
  // boxes.forEach(b => console.log(b.location.geoPoint));

  const treasures = range(total).map(() => Treasure.forge());
  const boxTreasureRelations = [];
  const treasuresWithTagOne = [];
  const treasuresWithTagOneAndTwo = [];
  const tagOne = generateID();
  const tagTwo = generateID();
  const boxesHaveTagOneTreasures = {};
  const boxesHaveTagOneAndTwoTreasures = {};

  for (const treasure of treasures) {
    treasure.name += `_${Date.now()}`;
    treasure.tags = new Tags();
    const box = sample(boxes);
    const r = new RelationBoxTreasure(null, {
      boxId: box.id,
      treasureId: treasure.id
    });
    boxTreasureRelations.push(r);

    if (Math.random() > 0.7) {
      treasure.tags.add(tagOne);
      treasuresWithTagOne.push(treasure);
      boxesHaveTagOneTreasures[box.id] = box;

      if (Math.random() > 0.5) {
        treasure.tags.add(tagTwo);
        treasuresWithTagOneAndTwo.push(treasure);
        boxesHaveTagOneAndTwoTreasures[box.id] = box;
      }
    }
  }

  const topTags = sampleSize(tagsPool, topCount);
  for (let i = 0; i < topTags.length; i++) {
    const tag = topTags[i];
    for (let j = 0; j < treasures.length; j++) {
      const treasure = treasures[j];
      treasure.tags.add(tag);
      if (j >= treasures.length - i) {
        break;
      }
    }
  }

  before(() => {
    cy.wrap(testUsers).each((user: User) => {
      theMockDatabase.insert(`${User.collection}/${user.id}`, user);
    });
    // loginTestUser(me);
  });

  before(() => {
    // Mock treasures in database
    cy.wrap(treasures).each((treasure: Treasure) => {
      // console.log(treasure.tags);
      const treasureJson = treasure.toJSON();
      // console.dir(treasureJson);
      theMockDatabase.insert(
        `${Treasure.collection}/${treasure.id}`,
        treasureJson
      );
    });
    // Spare some time for top tags updating in database
    cy.wait(1000);

    // Mock boxes in database
    cy.wrap(boxes).each((b: Box) => {
      const boxJson = b.toJSON();
      // console.dir(boxJson);
      theMockDatabase.insert(`${Box.collection}/${b.id}`, boxJson);
    });

    // Mock boxLocationRecords in database
    cy.wrap(boxLocationRecords).each((rcd: LocationRecord) => {
      theMockDatabase.insert(
        `${LocationRecord.collection}/${rcd.id}`,
        rcd.toJSON()
      );
    });

    // Mock box treasure relations in database
    cy.wrap(boxTreasureRelations).each((r: RelationBoxTreasure) => {
      theMockDatabase.insert(
        `${RelationBoxTreasure.collection}/${r.id}`,
        r.toJSON()
      );
    });
  });

  before(() => {
    myBeforeAll();
    cy.visit('/');
    gotoMapNavigatorPage();
    treasureMapPO.mapNavigatorPO.setCenter(mapCenter);
  });

  after(() => {
    theMockDatabase.clearCollection(
      TagRecord.tagsCollectionName(Treasure.collection)
    );
    theMockDatabase.clearCollection(Treasure.collection);
    theMockDatabase.clearCollection(Box.collection);
    theMockDatabase.clearCollection(LocationRecord.collection);
    theMockDatabase.clearCollection(RelationBoxTreasure.collection);
  });

  it('Show all boxes in the map view', () => {
    cy.wait(1000);
    treasureMapPO.mapNavigatorPO.expectItems(boxes);
  });

  it('Show all treasures in the treasure list', () => {
    treasureMapPO.treasureListPO.expectItems(treasures, { exact: true });
  });

  it('Show top 20 tags in tags search input', () => {
    // Go to map-navigator page
    // There should be options of top tags
    treasureMapPO.tagsControlPO.expectTopTags(topTags);
  });

  it('Search by one tag', () => {
    treasureMapPO.tagsControlPO.setValue(new Tags([tagOne]));
    treasureMapPO.mapNavigatorPO.expectItems(values(boxesHaveTagOneTreasures), {
      exact: true
    });
    treasureMapPO.treasureListPO.expectItems(treasuresWithTagOne, {
      exact: true
    });
  });

  it('Search by two tags', () => {
    treasureMapPO.tagsControlPO.setValue(new Tags([tagOne, tagTwo]));
    treasureMapPO.mapNavigatorPO.expectItems(
      values(boxesHaveTagOneAndTwoTreasures),
      {
        exact: true
      }
    );
    treasureMapPO.treasureListPO.expectItems(treasuresWithTagOneAndTwo, {
      exact: true
    });
  });
});
