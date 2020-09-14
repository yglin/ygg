import {
  ImitationItem,
  ImitationItemCells,
  ImitationItemTransfer,
  ItemTransferNotificationType,
  RelationshipItemHolder,
  RelationshipItemRequester,
  RelationshipItemTransferGiver,
  RelationshipItemTransferItem,
  RelationshipItemTransferReceiver
} from '@ygg/ourbox/core';
import {
  ItemPageObjectCypress,
  ItemTransferCompletePageObjectCypress,
  ItemTransferPageObjectCypress,
  MyItemTransfersPageObjectCypress
} from '@ygg/ourbox/test';
import { Location } from '@ygg/shared/omni-types/core';
import {
  logout as logoutBackground,
  theMockDatabase
} from '@ygg/shared/test/cypress';
import {
  EmceePageObjectCypress,
  YggDialogPageObjectCypress
} from '@ygg/shared/ui/test';
import { Notification, User } from '@ygg/shared/user/core';
import {
  AccountWidgetPageObjectCypress,
  loginTestUser,
  logout,
  MyNotificationListPageObjectCypress
} from '@ygg/shared/user/test';
import { SiteNavigator } from '../../support/site-navigator';

describe('Complete the item-transfer task', () => {
  const siteNavigator = new SiteNavigator();
  // const myHeldItemsPO = new MyHeldItemsPageObjectCypress();
  const itemPO = new ItemPageObjectCypress();
  const itemTransferPO = new ItemTransferPageObjectCypress();
  const emceePO = new EmceePageObjectCypress();
  const accountWidgetPO = new AccountWidgetPageObjectCypress();
  const myNotificationsPO = new MyNotificationListPageObjectCypress();
  const myItemTransfersPO = new MyItemTransfersPageObjectCypress();

  const testUser = User.forge();
  const testGiver = User.forge();
  const testReceiver = User.forge();
  const testItem = ImitationItem.forgeTheThing();
  testItem.ownerId = testUser.id;
  testItem.setState(ImitationItem.stateName, ImitationItem.states.transfer);
  testItem.setUserOfRole(RelationshipItemHolder.role, testGiver.id);
  testItem.addUsersOfRole(RelationshipItemRequester.role, [testReceiver.id]);
  const testItemTransfer = ImitationItemTransfer.forgeTheThing();
  testItemTransfer.name = `${testGiver.name} 交付 ${testItem.name} 給 ${testReceiver.name} 的交付任務`;
  testItemTransfer.setState(
    ImitationItemTransfer.stateName,
    ImitationItemTransfer.states.consented
  );
  testItemTransfer.addRelation(
    RelationshipItemTransferItem.createRelation(
      testItemTransfer.id,
      testItem.id
    )
  );
  testItemTransfer.setUserOfRole(
    RelationshipItemTransferGiver.role,
    testGiver.id
  );
  testItemTransfer.setUserOfRole(
    RelationshipItemTransferReceiver.role,
    testReceiver.id
  );
  const testItemTransferChanged = ImitationItemTransfer.forgeTheThing();
  testItemTransferChanged.name = testItemTransfer.name;
  const oldItemLocation: Location = testItem.getCellValue(
    ImitationItemCells.location.id
  );
  const newItemLocation: Location = Location.forge();

  before(() => {
    theMockDatabase.insert(`${User.collection}/${testUser.id}`, testUser);
    theMockDatabase.insert(`${User.collection}/${testGiver.id}`, testGiver);
    theMockDatabase.insert(
      `${User.collection}/${testReceiver.id}`,
      testReceiver
    );
    theMockDatabase.insert(`${testItem.collection}/${testItem.id}`, testItem);
    theMockDatabase.insert(
      `${ImitationItemTransfer.collection}/${testItemTransfer.id}`,
      testItemTransfer
    );
    logoutBackground().then(() => {
      cy.visit('/');
      loginTestUser(testReceiver);
      siteNavigator.gotoMyItemTransfers();
      myItemTransfersPO.expectVisible();
      myItemTransfersPO.gotoItemTransfer(testItemTransfer);
      itemTransferPO.expectVisible();
    });
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Can complete item-transfer only in state "consented"', () => {
    // State new
    testItemTransfer.setState(
      ImitationItemTransfer.stateName,
      ImitationItemTransfer.states.new
    );
    theMockDatabase.insert(
      `${testItemTransfer.collection}/${testItemTransfer.id}`,
      testItemTransfer
    );
    cy.wait(1000);
    itemTransferPO.theThingPO.expectNoActionButton(
      ImitationItemTransfer.actions['confirm-completed']
    );

    // State editing
    testItemTransfer.setState(
      ImitationItemTransfer.stateName,
      ImitationItemTransfer.states.editing
    );
    theMockDatabase.insert(
      `${testItemTransfer.collection}/${testItemTransfer.id}`,
      testItemTransfer
    );
    cy.wait(1000);
    itemTransferPO.theThingPO.expectNoActionButton(
      ImitationItemTransfer.actions['confirm-completed']
    );

    // State waitReceiver
    testItemTransfer.setState(
      ImitationItemTransfer.stateName,
      ImitationItemTransfer.states.waitReceiver
    );
    theMockDatabase.insert(
      `${testItemTransfer.collection}/${testItemTransfer.id}`,
      testItemTransfer
    );
    cy.wait(1000);
    itemTransferPO.theThingPO.expectNoActionButton(
      ImitationItemTransfer.actions['confirm-completed']
    );

    // State completed
    testItemTransfer.setState(
      ImitationItemTransfer.stateName,
      ImitationItemTransfer.states.completed
    );
    theMockDatabase.insert(
      `${testItemTransfer.collection}/${testItemTransfer.id}`,
      testItemTransfer
    );
    cy.wait(1000);
    itemTransferPO.theThingPO.expectNoActionButton(
      ImitationItemTransfer.actions['confirm-completed']
    );

    // State consented
    testItemTransfer.setState(
      ImitationItemTransfer.stateName,
      ImitationItemTransfer.states.consented
    );
    theMockDatabase.insert(
      `${testItemTransfer.collection}/${testItemTransfer.id}`,
      testItemTransfer
    );
    cy.wait(1000);
    itemTransferPO.theThingPO.expectActionButton(
      ImitationItemTransfer.actions['confirm-completed']
    );
  });

  it('Can complete item-transfer only as receiver', () => {
    logout();
    loginTestUser(testGiver);
    cy.wait(1000);
    itemTransferPO.theThingPO.expectNoActionButton(
      ImitationItemTransfer.actions['confirm-completed']
    );

    logout();
    loginTestUser(testReceiver);
    cy.wait(1000);
    itemTransferPO.theThingPO.expectActionButton(
      ImitationItemTransfer.actions['confirm-completed']
    );
  });

  it('Complete item-transfer', () => {
    itemTransferPO.theThingPO.runAction(
      ImitationItemTransfer.actions['confirm-completed']
    );
    const dialogPO = new YggDialogPageObjectCypress();
    const itemTransferCompletePO = new ItemTransferCompletePageObjectCypress(
      dialogPO.getSelector()
    );
    itemTransferCompletePO.expectVisible();
    itemTransferCompletePO.expectHint(
      `確認已收到 ${testItem.name}，請更新寶物所在的位置`
    );
    itemTransferCompletePO.expectLocation(oldItemLocation);
    itemTransferCompletePO.setLocation(newItemLocation);
    dialogPO.confirm();
    emceePO.alert(
      `已通知 ${testGiver.name}, ${testItem.name} 的交付任務已完成`
    );
    itemTransferPO.theThingPO.expectState(
      ImitationItemTransfer.states.completed
    );
  });

  it('Item state should back to "available"', () => {
    itemTransferPO.gotoItem();
    itemPO.expectVisible();
    itemPO.theThingPO.expectName(testItem.name);
    itemPO.theThingPO.expectState(ImitationItem.states.available);
  });

  it('Item holder should now be the receiver', () => {
    itemPO.expectHolder(testReceiver);
  });

  it('Item requesters should not include receiver', () => {
    itemPO.expectNotRequester(testReceiver);
  });

  it('Item should be at new location', () => {
    itemPO.theThingPO.expectCellValue(
      ImitationItemCells.location.id,
      ImitationItemCells.location.type,
      newItemLocation
    );
  });

  it('Should send notification to giver', () => {
    const notification = new Notification({
      type: ItemTransferNotificationType,
      inviterId: testReceiver.id,
      inviteeId: testGiver.id,
      email: testGiver.email,
      mailSubject: `${testReceiver.name} 已收到 ${testItem.name}`,
      mailContent: `${testReceiver.name} 已收到 ${testItem.name}，請點選以下網址檢視交付記錄`,
      confirmMessage: `<h3>您將前往交付記錄頁面</h3>`,
      landingUrl: `/${ImitationItemTransfer.routePath}/${testItemTransfer.id}`,
      data: {}
    });
    logout();
    loginTestUser(testGiver);
    accountWidgetPO.expectNotification(1);
    accountWidgetPO.clickNotification();
    myNotificationsPO.expectVisible();
    myNotificationsPO.expectUnreadNotifications([notification]);
    myNotificationsPO.clickNotification(notification);
    emceePO.confirm(`您將前往交付記錄頁面`);
    itemTransferPO.expectVisible();
    itemTransferPO.theThingPO.expectValue(testItemTransfer);
    itemTransferPO.theThingPO.expectState(
      ImitationItemTransfer.states.completed
    );
  });
});
