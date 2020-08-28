import {
  ImitationItem,
  ImitationBox,
  RelationshipBoxMember
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
  const memberRelation = RelationshipBoxMember.createRelationRecord(
    testBox.id,
    testUser.id
  );

  before(() => {
    theMockDatabase.insert(`${User.collection}/${testUser.id}`, testUser);
    theMockDatabase.insert(`${testBox.collection}/${testBox.id}`, testBox);
    theMockDatabase.insert(
      `${RelationRecord.collection}/${memberRelation.id}`,
      memberRelation
    );
    cy.visit('/');
    loginTestUser(testUser);
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Create an item in-editing with required data cells', () => {
    const testItem = ImitationItem.forgeTheThing();
    siteNavigator.gotoMyBoxes();
    myBoxesPO.expectVisible();
    myBoxesPO.gotoBox(testBox);
    boxViewPO.expectVisible();
    boxViewPO.gotoCreateItem();
    itemPO.expectVisible();
    itemPO.createItem(testItem);
    boxViewPO.expectVisible();
    boxViewPO.expectItemInEditing(testItem);
    boxViewPO.gotoItem(testItem);
    itemPO.expectVisible();
    itemPO.expectItem(testItem);
    // itemPO.expectHolder(testUser);
    // itemPO.expectNoRequester();
  });
});
