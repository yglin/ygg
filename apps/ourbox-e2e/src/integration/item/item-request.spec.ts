import {
  ImitationItem,
  ImitationBox,
  RelationshipBoxMember,
  RelationshipItemHolder,
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
import { loginTestUser, logout } from '@ygg/shared/user/test';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';

describe('Request for item', () => {
  const siteNavigator = new SiteNavigator();
  const myBoxesPO = new MyBoxesPageObjectCypress();
  const boxViewPO = new BoxViewPageObjectCypress();
  const itemPO = new ItemPageObjectCypress();
  const emceePO = new EmceePageObjectCypress();

  const testUser1 = User.forge();
  const testUser2 = User.forge();
  const testBox = ImitationBox.forgeTheThing();
  const memberRelation1 = RelationshipBoxMember.createRelationRecord(
    testBox.id,
    testUser1.id
  );
  const memberRelation2 = RelationshipBoxMember.createRelationRecord(
    testBox.id,
    testUser2.id
  );
  const testItem = ImitationItem.forgeTheThing();
  testItem.setState(ImitationItem.stateName, ImitationItem.states.available);
  const itemRelation = RelationshipBoxItem.createRelationRecord(
    testBox.id,
    testItem.id
  );
  const itemHolder: User = testUser1;
  testItem.ownerId = itemHolder.id;
  const holderRelation = RelationshipItemHolder.createRelationRecord(
    testItem.id,
    itemHolder.id
  );

  before(() => {
    theMockDatabase.insert(`${User.collection}/${testUser1.id}`, testUser1);
    theMockDatabase.insert(`${User.collection}/${testUser2.id}`, testUser2);
    theMockDatabase.insert(`${testBox.collection}/${testBox.id}`, testBox);
    theMockDatabase.insert(
      `${RelationRecord.collection}/${memberRelation1.id}`,
      memberRelation1
    );
    theMockDatabase.insert(
      `${RelationRecord.collection}/${memberRelation2.id}`,
      memberRelation2
    );
    theMockDatabase.insert(`${testItem.collection}/${testItem.id}`, testItem);
    theMockDatabase.insert(
      `${RelationRecord.collection}/${itemRelation.id}`,
      itemRelation
    );
    theMockDatabase.insert(
      `${RelationRecord.collection}/${holderRelation.id}`,
      holderRelation
    );
    cy.visit('/');
    loginTestUser(testUser1);
    siteNavigator.gotoMyBoxes();
    myBoxesPO.expectVisible();
    myBoxesPO.gotoBox(testBox);
    boxViewPO.expectVisible();
    boxViewPO.gotoItem(testItem);
    itemPO.expectVisible();
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Holder can not request', () => {
    itemPO.theThingPO.expectNoActionButton(ImitationItem.actions['request']);
  });

  it('Request item in item view page', () => {
    logout();
    loginTestUser(testUser2);
    itemPO.theThingPO.runAction(ImitationItem.actions['request']);
    emceePO.confirm(`送出索取 ${testItem.name} 的請求，並且排隊等待？`);
    emceePO.alert(`已送出索取 ${testItem.name} 的請求`);
    itemPO.expectRequester(testUser2, 0);
  });

  it('Can not request if alreay in request list', () => {
    itemPO.theThingPO.expectNoActionButton(ImitationItem.actions['request']);
  });

  it('Cancel request', () => {
    itemPO.theThingPO.runAction(ImitationItem.actions['cancel-request']);
    emceePO.confirm(`要取消索取 ${testItem.name} 嗎？`);
    emceePO.alert(`已取消索取 ${testItem.name}`);
    itemPO.expectNotRequester(testUser2);
  });

  it('Can not cancel if not in request list', () => {
    itemPO.theThingPO.expectNoActionButton(ImitationItem.actions['cancel-request']);    
  });
  
});
