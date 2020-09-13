import {
  ImitationItem,
  ImitationBox,
  RelationshipBoxMember,
  RelationshipBoxItem
} from '@ygg/ourbox/core';
import {
  ItemPageObjectCypress,
  MyBoxesPageObjectCypress,
  BoxViewPageObjectCypress
} from '@ygg/ourbox/test';
import { SiteNavigator } from '../../support/site-navigator';
import { User } from '@ygg/shared/user/core';
import { theMockDatabase } from '@ygg/shared/test/cypress';
import { RelationRecord } from '@ygg/the-thing/core';
import { loginTestUser } from '@ygg/shared/user/test';

describe('Create item in box', () => {
  const siteNavigator = new SiteNavigator();
  const myBoxesPO = new MyBoxesPageObjectCypress();
  const boxViewPO = new BoxViewPageObjectCypress();
  const itemPO = new ItemPageObjectCypress();
  const testUser = User.forge();
  const testBox = ImitationBox.forgeTheThing();
  testBox.ownerId = testUser.id;
  testBox.setState(ImitationBox.stateName, ImitationBox.states.open);
  testBox.addUsersOfRole(RelationshipBoxMember.role, [testUser.id]);
  const testItem = ImitationItem.forgeTheThing();
  testItem.setState(ImitationItem.stateName, ImitationItem.states.available);

  before(() => {
    theMockDatabase.insert(`${User.collection}/${testUser.id}`, testUser);
    theMockDatabase.insert(`${testBox.collection}/${testBox.id}`, testBox);
    theMockDatabase.insert(`${testItem.collection}/${testItem.id}`, testItem);
    cy.visit('/');
    loginTestUser(testUser);
    siteNavigator.gotoMyBoxes();
    myBoxesPO.expectVisible();
    myBoxesPO.gotoBox(testBox);
    boxViewPO.expectVisible();
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Show create-item hint if there is no item yet', () => {
    boxViewPO.expectCreateItemHint();
  });

  it('Hide create-item hint if there is any item', () => {
    cy.wrap(
      new Cypress.Promise((resolve, reject) => {
        testBox.addRelation(
          RelationshipBoxItem.createRelation(testBox.id, testItem.id)
        );
        theMockDatabase.insert(`${testBox.collection}/${testBox.id}`, testBox);
        resolve();
      })
    ).then(() => {
      cy.wait(1000);
      boxViewPO.expectItem(testItem);
      boxViewPO.expectNoCreateItemHint();
    });
  });

  it('Create an item in-editing with required data cells', () => {
    const testItem2 = ImitationItem.forgeTheThing();
    boxViewPO.theThingPO.runAction(ImitationBox.actions['create-item']);
    itemPO.expectVisible();
    itemPO.createItem(testItem2);
    boxViewPO.expectVisible();
    cy.wait(1000);
    boxViewPO.expectItemInEditing(testItem2);
    boxViewPO.gotoItem(testItem2);
    itemPO.expectVisible();
    itemPO.expectItem(testItem2);
  });

  it('Create an item and make it available as well', () => {
    const testItem3 = ImitationItem.forgeTheThing();
    siteNavigator.gotoMyBoxes();
    myBoxesPO.expectVisible();
    myBoxesPO.gotoBox(testBox);
    boxViewPO.expectVisible();
    boxViewPO.theThingPO.runAction(ImitationBox.actions['create-item']);
    itemPO.expectVisible();
    itemPO.createItem(testItem3, { makeAvailable: true });
    boxViewPO.expectVisible();
    cy.wait(1000);
    boxViewPO.expectItemAvailable(testItem3);
    boxViewPO.gotoItem(testItem3);
    itemPO.expectVisible();
    itemPO.expectItem(testItem3);
    itemPO.theThingPO.expectState(ImitationItem.states.available);
    itemPO.expectHolder(testUser);
    itemPO.expectNoRequester();
  });
});
