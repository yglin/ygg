import {
  ImitationItem,
  ImitationBox,
  RelationshipBoxItem,
  RelationshipBoxMember,
  RelationshipItemHolder,
  RelationshipItemRequester,
  ImitationItemTransfer
} from '@ygg/ourbox/core';
import { User } from '@ygg/shared/user/core';
import {
  theMockDatabase,
  logout as logoutBackground
} from '@ygg/shared/test/cypress';
import { loginTestUser, logout } from '@ygg/shared/user/test';
import { RelationRecord } from '@ygg/the-thing/core';
import { SiteNavigator } from '../../support/site-navigator';
import {
  MyBoxesPageObjectCypress,
  BoxViewPageObjectCypress,
  ItemPageObjectCypress,
  MyHeldItemsPageObjectCypress,
  ItemTransferPageObjectCypress
} from '@ygg/ourbox/test';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';

describe('Create an item-transfer task', () => {
  const siteNavigator = new SiteNavigator();
  const myHeldItemsPO = new MyHeldItemsPageObjectCypress();
  const itemPO = new ItemPageObjectCypress();
  const itemTransferPO = new ItemTransferPageObjectCypress();
  const emceePO = new EmceePageObjectCypress();

  const testUser = User.forge();
  const testHolder = User.forge();
  const testRequester = User.forge();
  const testItem = ImitationItem.forgeTheThing();
  testItem.ownerId = testUser.id;
  testItem.setState(ImitationItem.stateName, ImitationItem.states.available);
  const itemHolderRelation = RelationshipItemHolder.createRelationRecord(
    testItem.id,
    testHolder.id
  );
  const itemRequestRelation = RelationshipItemRequester.createRelationRecord(
    testItem.id,
    testRequester.id
  );

  before(() => {
    theMockDatabase.insert(`${User.collection}/${testUser.id}`, testUser);
    theMockDatabase.insert(`${User.collection}/${testHolder.id}`, testHolder);
    theMockDatabase.insert(
      `${User.collection}/${testRequester.id}`,
      testRequester
    );
    theMockDatabase.insert(
      `${ImitationItem.collection}/${testItem.id}`,
      testItem
    );
    theMockDatabase.insert(
      `${RelationRecord.collection}/${itemHolderRelation.id}`,
      itemHolderRelation
    );
    theMockDatabase.insert(
      `${RelationRecord.collection}/${itemRequestRelation.id}`,
      itemRequestRelation
    );
    logoutBackground().then(() => {
      cy.visit('/');
      loginTestUser(testHolder);
      siteNavigator.gotoMyHeldItems();
      myHeldItemsPO.expectVisible();
      myHeldItemsPO.gotoItem(testItem);
      itemPO.expectVisible();
    });
  });

  it('Can not create item-transfer if item not available', () => {
    testItem.setState(ImitationItem.stateName, ImitationItem.states.editing);
    theMockDatabase.insert(
      `${ImitationItem.collection}/${testItem.id}`,
      testItem
    );
    itemPO.theThingPO.expectNoActionButton(
      ImitationItem.actions['transfer-next']
    );
    testItem.setState(ImitationItem.stateName, ImitationItem.states.available);
    theMockDatabase.insert(
      `${ImitationItem.collection}/${testItem.id}`,
      testItem
    );
    itemPO.theThingPO.expectActionButton(
      ImitationItem.actions['transfer-next']
    );
  });

  it('Can not create item-transfer if not item holder', () => {
    logout();
    loginTestUser(testUser);
    itemPO.theThingPO.expectNoActionButton(
      ImitationItem.actions['transfer-next']
    );
    logout();
    loginTestUser(testHolder);
    itemPO.theThingPO.expectActionButton(
      ImitationItem.actions['transfer-next']
    );
  });

  it('Can not create item-transfer if no one in request list', () => {
    theMockDatabase.delete(
      `${RelationRecord.collection}/${itemRequestRelation.id}`
    );
    itemPO.theThingPO.expectNoActionButton(
      ImitationItem.actions['transfer-next']
    );
    theMockDatabase.insert(
      `${RelationRecord.collection}/${itemRequestRelation.id}`,
      itemRequestRelation
    );
    itemPO.theThingPO.expectActionButton(
      ImitationItem.actions['transfer-next']
    );
  });

  it('Create an item-transfer for first requester in request list', () => {
    itemPO.theThingPO.runAction(ImitationItem.actions['transfer-next']);
    emceePO.confirm(`要將 ${testItem.name} 交付給 ${testRequester.name} ？`);
    itemTransferPO.expectVisible();
    const testItemTransfer = ImitationItemTransfer.forgeTheThing();
    testItemTransfer.name = `${testHolder.name} 交付 ${testItem.name} 給 ${testRequester.name} 的交付任務`;
    itemTransferPO.theThingPO.expectName(testItemTransfer.name);
    itemTransferPO.expectGiver(testHolder);
    itemTransferPO.expectReceiver(testRequester);
    itemTransferPO.theThingPO.setValue(testItemTransfer);
    itemTransferPO.theThingPO.save(testItemTransfer);
    
    emceePO.confirm(
      `確認約定時間和地點無誤，送出交付請求給 ${testRequester.name}？`
    );
    emceePO.alert(`已送出 ${testItem.name} 的交付要求，請等待 ${testRequester.name} 的回應`)
    itemPO.expectVisible();
    itemPO.theThingPO.expectState(ImitationItem.states.transfer);
    itemPO.theThingPO.expectActionButton(
      ImitationItem.actions['check-item-transfer']
    );
  });

  // it('Send notification about item-transfer to receiver', () => {});
});
