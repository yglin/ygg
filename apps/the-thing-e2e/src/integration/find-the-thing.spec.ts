import { values, range } from 'lodash';
import { v4 as uuid } from 'uuid';
import { kakapo, kiwi, littlePenguin } from './australia-birbs';
import { Frodo, Sam, Gollum } from './hobbits';
import { MockDatabase, login, getCurrentUser } from '@ygg/shared/test/cypress';
import { TheThing, TheThingFilter } from '@ygg/the-thing/core';
import {
  TheThingListPageObjectCypress,
  TheThingFilterPageObjectCypress
} from '../page-objects/the-thing';

const mockDatabase = new MockDatabase();

before(() => {
  login();
  getCurrentUser().then(user => {
    kakapo.ownerId = user.id;
    kiwi.ownerId = user.id;
    // littlePenguin.ownerId = user.id;
    mockDatabase.insert(`${TheThing.collection}/${kakapo.id}`, kakapo.toJSON());
    mockDatabase.insert(`${TheThing.collection}/${kiwi.id}`, kiwi.toJSON());
    mockDatabase.insert(
      `${TheThing.collection}/${littlePenguin.id}`,
      littlePenguin.toJSON()
    );
    mockDatabase.insert(`${TheThing.collection}/${Frodo.id}`, Frodo.toJSON());
    mockDatabase.insert(`${TheThing.collection}/${Sam.id}`, Sam.toJSON());
    mockDatabase.insert(`${TheThing.collection}/${Gollum.id}`, Gollum.toJSON());
  });
  cy.visit('/');
});

after(() => {
  mockDatabase.clear();
});

describe('Find the-things by query conditions', () => {
  it('Find my the-things', () => {
    cy.visit('/the-things/my');
    const theThingListPO = new TheThingListPageObjectCypress();
    theThingListPO.expectVisible();
    theThingListPO.expectTheThing(kakapo);
    theThingListPO.expectTheThing(kiwi);
    theThingListPO.expectNoTheThing(littlePenguin);
  });

  it('Find the-things by query tags', () => {
    const testTags = range(3).map(() => uuid());
    Frodo.tags.push(...testTags);
    mockDatabase.insert(`${TheThing.collection}/${Frodo.id}`, Frodo.toJSON());
    Sam.tags.push(...testTags);
    mockDatabase.insert(`${TheThing.collection}/${Sam.id}`, Sam.toJSON());
    cy.visit('/the-things/');
    const theThingFilterPO = new TheThingFilterPageObjectCypress();
    theThingFilterPO.clear();
    theThingFilterPO.setTags(testTags);
    const theThingListPO = new TheThingListPageObjectCypress();
    theThingListPO.expectTheThing(Frodo);
    theThingListPO.expectTheThing(Sam);
    theThingListPO.expectCount(2);
  });

  it('Find the-things by search keyword in name', () => {
    const testKeyword = ' not F**king Gay';
    Frodo.name += testKeyword;
    mockDatabase.insert(`${TheThing.collection}/${Frodo.id}`, Frodo.toJSON());
    Sam.name += testKeyword;
    mockDatabase.insert(`${TheThing.collection}/${Sam.id}`, Sam.toJSON());
    cy.visit('/the-things/');
    const theThingFilterPO = new TheThingFilterPageObjectCypress();
    theThingFilterPO.clear();
    theThingFilterPO.searchName(testKeyword);
    const theThingListPO = new TheThingListPageObjectCypress();
    theThingListPO.expectTheThing(Frodo);
    theThingListPO.expectTheThing(Sam);
    theThingListPO.expectCount(2);
  });

  it('Can save filter and load it back', () => {
    const filter = new TheThingFilter({
      name: 'Chubby Dumb-Ass Birbs',
      tags: ['dumb', 'fat-ass'],
      keywordName: 'the chubby'
    });
    kakapo.tags.push(...filter.tags);
    kakapo.name += `(${filter.keywordName})`;
    mockDatabase.insert(`${TheThing.collection}/${kakapo.id}`, kakapo.toJSON());
    kiwi.tags.push(...filter.tags);
    kiwi.name += `(${filter.keywordName})`;
    mockDatabase.insert(`${TheThing.collection}/${kiwi.id}`, kiwi.toJSON());

    cy.visit('/the-things/');
    const theThingFilterPO = new TheThingFilterPageObjectCypress();
    theThingFilterPO.setFilter(filter);
    const theThingListPO = new TheThingListPageObjectCypress();
    theThingListPO.expectTheThings([kakapo, kiwi]);
    theThingFilterPO.saveFilter(filter.name);

    cy.visit('/the-things/');
    theThingFilterPO.loadFilter(filter.name);
    theThingListPO.expectTheThings([kakapo, kiwi]);
  });
});
