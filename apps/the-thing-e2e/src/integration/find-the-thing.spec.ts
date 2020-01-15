import { values } from 'lodash';
import { kakapo, kiwi, littlePenguin} from './australia-birbs';
import { MockDatabase, login, getCurrentUser } from '@ygg/shared/test/cypress';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingListPageObjectCypress } from '../page-objects/the-thing';

const mockDatabase = new MockDatabase();

before(function() {
  login();
  getCurrentUser().then(user => {
    kakapo.ownerId = user.id;
    kiwi.ownerId = user.id;
    // littlePenguin.ownerId = user.id;
    mockDatabase.insert(`${TheThing.collection}/${kakapo.id}`, kakapo.toJSON());
    mockDatabase.insert(`${TheThing.collection}/${kiwi.id}`, kiwi.toJSON());
    mockDatabase.insert(`${TheThing.collection}/${littlePenguin.id}`, littlePenguin.toJSON());
  });
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
});
