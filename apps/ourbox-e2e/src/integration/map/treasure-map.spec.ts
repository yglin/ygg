import { Treasure } from '@ygg/ourbox/core';
import { generateID } from '@ygg/shared/infra/core';
import { TagRecords, Tags } from '@ygg/shared/tags/core';
import { theMockDatabase } from '@ygg/shared/test/cypress';
import { orderBy, range, sampleSize } from 'lodash';
import { gotoMapNavigatorPage } from './map';
import { TreasureMapPageObjectCypress } from '@ygg/ourbox/test';
import { loginTestUser, testUsers } from '@ygg/shared/user/test';
import { User } from '@ygg/shared/user/core';

describe('Search and navigate in treasure map', () => {
  const treasureMapPO = new TreasureMapPageObjectCypress();
  const me = testUsers[1];

  before(() => {
    cy.wrap(testUsers).each((user: User) => {
      theMockDatabase.insert(`${User.collection}/${user.id}`, user);
    });
    cy.visit('/');
    // loginTestUser(me);
  });

  after(() => {
    theMockDatabase.clearCollection(TagRecords.collection);
    theMockDatabase.clearCollection(Treasure.collection);
  });

  it('Show top 20 tags in tags search input', () => {
    // Mock top 20 tags in database
    const topCount = 20;
    const tagsPool = range(topCount * 3).map(() => generateID());
    const treasures = range(topCount * 3).map(() => Treasure.forge());
    for (const treasure of treasures) {
      treasure.name += `_${Date.now()}`;
      treasure.tags = new Tags();
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

    cy.wrap(treasures).each((treasure: Treasure) => {
      console.log(treasure.tags);
      theMockDatabase.insert(
        `${Treasure.collection}/${treasure.id}`,
        treasure.toJSON()
      );
    });
    // cy.pause();
    // Spare some time for tags updating in database
    cy.wait(1000);

    // Go to map-navigator page
    gotoMapNavigatorPage();

    // There should be options of top tags
    treasureMapPO.tagsControlPO.expectTopTags(topTags);
  });

  // it('Search by tags', () => {

  // });

  // it('Search my neighbor area', () => {

  // });
});
