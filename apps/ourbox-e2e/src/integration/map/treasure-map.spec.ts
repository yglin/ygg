import { Treasure } from '@ygg/ourbox/core';
import { generateID } from '@ygg/shared/infra/core';
import { Tags } from '@ygg/shared/tags/core';
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

  it('Show top 20 tags in tags search input', () => {
    // Mock top 20 tags in database
    const topCount = 20;
    const tagsPool = range(topCount * 3).map(() => generateID());
    const treasures = range(topCount * 3).map(() => Treasure.forge());
    const tagsCount = {};
    for (const treasure of treasures) {
      treasure.name += `_${Date.now()}`;
      const tags = sampleSize(tagsPool, topCount);
      treasure.tags = new Tags(tags);
      for (const tag of tags) {
        if (!(tag in tagsCount)) {
          tagsCount[tag] = { name: tag, count: 0 };
        }
        tagsCount[tag].count += 1;
      }
    }
    // console.dir(tagsCount);
    const topTags = orderBy(tagsCount, ['count'], ['desc'])
      .map((t: any) => t.name)
      .slice(0, topCount);
    // console.dir(topTags);
    cy.wrap(treasures).each((treasure: Treasure) =>
      theMockDatabase.insert(
        `${Treasure.collection}/${treasure.id}`,
        treasure.toJSON()
      )
    );
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
