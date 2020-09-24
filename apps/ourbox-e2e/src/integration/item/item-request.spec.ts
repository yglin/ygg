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
import { beforeAll, theMockDatabase } from '@ygg/shared/test/cypress';
import { RelationRecord } from '@ygg/the-thing/core';
import { loginTestUser, logout, testUsers } from '@ygg/shared/user/test';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';

describe('Request for item', () => {
  const siteNavigator = new SiteNavigator();
  const myBoxesPO = new MyBoxesPageObjectCypress();
  const boxViewPO = new BoxViewPageObjectCypress();
  const itemPO = new ItemPageObjectCypress();
  const emceePO = new EmceePageObjectCypress();

  const testUser1 = testUsers[0];
  const testUser2 = testUsers[1];
  const testUser3 = testUsers[2];
  const testBox = ImitationBox.forgeTheThing();
  testBox.addUsersOfRole(RelationshipBoxMember.role, [
    testUser1.id,
    testUser2.id
  ]);
  const testItem = ImitationItem.forgeTheThing();
  testItem.setState(ImitationItem.stateName, ImitationItem.states.available);
  const itemRelation = RelationshipBoxItem.createRelationRecord(
    testBox.id,
    testItem.id
  );
  const itemHolder: User = testUser1;
  testItem.ownerId = itemHolder.id;
  testItem.setUserOfRole(RelationshipItemHolder.role, itemHolder.id);

  before(() => {
    beforeAll();
    theMockDatabase.insert(`${User.collection}/${testUser1.id}`, testUser1);
    theMockDatabase.insert(`${User.collection}/${testUser2.id}`, testUser2);
    theMockDatabase.insert(`${User.collection}/${testUser3.id}`, testUser3);
    theMockDatabase.insert(`${testBox.collection}/${testBox.id}`, testBox);
    theMockDatabase.insert(`${testItem.collection}/${testItem.id}`, testItem);
    theMockDatabase.insert(
      `${RelationRecord.collection}/${itemRelation.id}`,
      itemRelation
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
    logout();
    loginTestUser(testUser2);
    itemPO.theThingPO.expectActionButton(ImitationItem.actions['request']);
  });

  it('Can request item only in state available', () => {
    testItem.setState(ImitationItem.stateName, ImitationItem.states.new);
    theMockDatabase.insert(
      `${ImitationItem.collection}/${testItem.id}`,
      testItem
    );
    itemPO.theThingPO.expectNoActionButton(ImitationItem.actions['request']);

    testItem.setState(ImitationItem.stateName, ImitationItem.states.editing);
    theMockDatabase.insert(
      `${ImitationItem.collection}/${testItem.id}`,
      testItem
    );
    itemPO.theThingPO.expectNoActionButton(ImitationItem.actions['request']);

    testItem.setState(ImitationItem.stateName, ImitationItem.states.transfer);
    theMockDatabase.insert(
      `${ImitationItem.collection}/${testItem.id}`,
      testItem
    );
    itemPO.theThingPO.expectNoActionButton(ImitationItem.actions['request']);

    testItem.setState(ImitationItem.stateName, ImitationItem.states.available);
    theMockDatabase.insert(
      `${ImitationItem.collection}/${testItem.id}`,
      testItem
    );
    itemPO.theThingPO.expectActionButton(ImitationItem.actions['request']);
  });

  it('Request item in item view page', () => {
    logout();
    loginTestUser(testUser2);
    itemPO.theThingPO.runAction(ImitationItem.actions['request']);
    emceePO.confirm(`送出索取 ${testItem.name} 的請求，並且排隊等待？`);
    emceePO.alert(`已送出索取 ${testItem.name} 的請求`);
    itemPO.expectRequester(testUser2, 0);
  });

  it('Next requester takes second place in line', () => {
    logout();
    loginTestUser(testUser3);
    itemPO.theThingPO.runAction(ImitationItem.actions['request']);
    emceePO.confirm(`送出索取 ${testItem.name} 的請求，並且排隊等待？`);
    emceePO.alert(`已送出索取 ${testItem.name} 的請求`);
    itemPO.expectRequester(testUser3, 1);
  });

  it('Can not request if alreay in request list', () => {
    logout();
    loginTestUser(testUser2);
    itemPO.theThingPO.expectNoActionButton(ImitationItem.actions['request']);
  });

  it('Cancel request', () => {
    itemPO.theThingPO.runAction(ImitationItem.actions['cancel-request']);
    emceePO.confirm(`要取消索取 ${testItem.name} 嗎？`);
    emceePO.alert(`已取消索取 ${testItem.name}`);
    itemPO.expectNotRequester(testUser2);
  });

  it('Next requester fills the vacancy', () => {
    itemPO.expectRequester(testUser3, 0);
  });

  it('Can not cancel if not in request list', () => {
    itemPO.theThingPO.expectNoActionButton(
      ImitationItem.actions['cancel-request']
    );
  });
});
