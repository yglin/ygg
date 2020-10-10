import {
  ImitationItem,
  ImitationBox,
  RelationshipBoxMember,
  RelationshipBoxItem
} from '@ygg/ourbox/core';
import {
  ItemPageObjectCypress,
  MyBoxesPageObjectCypress,
  BoxViewPageObjectCypress,
  ItemWarehousePageObjectCypress,
  MapSearchPageObjectCypress
} from '@ygg/ourbox/test';
import { SiteNavigator } from '../../support/site-navigator';
import { User } from '@ygg/shared/user/core';
import { beforeAll, theMockDatabase } from '@ygg/shared/test/cypress';
import { RelationRecord } from '@ygg/the-thing/core';
import { loginTestUser, testUsers } from '@ygg/shared/user/test';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';
import { Comment } from '@ygg/shared/thread/core';
import { Html } from '@ygg/shared/omni-types/core';

describe('Publish item to be available', () => {
  const siteNavigator = new SiteNavigator();
  const myBoxesPO = new MyBoxesPageObjectCypress();
  const boxViewPO = new BoxViewPageObjectCypress();
  const itemWarehousePO = new ItemWarehousePageObjectCypress();
  const itemPO = new ItemPageObjectCypress();
  const mapSearchPO = new MapSearchPageObjectCypress();

  const testUser = testUsers[0];
  const testBox = ImitationBox.forgeTheThing();
  testBox.ownerId = testUser.id;
  testBox.setState(ImitationBox.stateName, ImitationBox.states.open);
  testBox.addUsersOfRole(RelationshipBoxMember.role, [testUser.id]);
  const testItem = ImitationItem.forgeTheThing();
  testItem.setState(ImitationItem.stateName, ImitationItem.states.editing);
  testItem.ownerId = testUser.id;
  testBox.addRelation(
    RelationshipBoxItem.createRelation(testBox.id, testItem.id)
  );

  before(() => {
    beforeAll();
    theMockDatabase.insert(`${User.collection}/${testUser.id}`, testUser);
    theMockDatabase.insert(`${testBox.collection}/${testBox.id}`, testBox);
    theMockDatabase.insert(`${testItem.collection}/${testItem.id}`, testItem);
    cy.visit('/');
    loginTestUser(testUser);
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Non-available item will not show in item-warehouse', () => {
    siteNavigator.gotoItemWarehouse();
    itemWarehousePO.expectVisible();
    itemWarehousePO.expectNotItem(testItem);
  });

  it('Non-available item will not show in map-search', () => {
    siteNavigator.gotoMapSearch();
    mapSearchPO.expectVisible();
    mapSearchPO.centerAtItem(testItem);
    mapSearchPO.expectNotItems([testItem]);
  });

  it('Non-available item can not be commented', () => {
    siteNavigator.gotoMyBoxes();
    myBoxesPO.expectVisible();
    myBoxesPO.gotoBox(testBox);
    boxViewPO.expectVisible();
    boxViewPO.gotoItem(testItem);
    itemPO.expectVisible();
    itemPO.threadPO.expectNotVisible();
  });

  it('Publish item to be available', () => {
    itemPO.publishAvailable(testItem);
    itemPO.theThingPO.expectState(ImitationItem.states.available);
  });

  it('Available item can be commented', () => {
    const crapComment = new Comment({
      subjectId: testItem.id,
      ownerId: testUser.id,
      content: new Html('<h2>I like to MOVE IT MOVE IT</h2>')
    });
    itemPO.threadPO.addComment(crapComment);
    itemPO.threadPO.expectLatestComment(crapComment);
  });

  it('Available item will show in item-warehouse', () => {
    siteNavigator.gotoItemWarehouse();
    itemWarehousePO.expectVisible();
    itemWarehousePO.expectItem(testItem);
  });

  it('Available item will show in map-search', () => {
    siteNavigator.gotoMapSearch();
    mapSearchPO.expectVisible();
    mapSearchPO.centerAtItem(testItem);
    mapSearchPO.expectItems([testItem]);
  });
});
