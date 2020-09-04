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
import { Location, Html } from '@ygg/shared/omni-types/core';
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
import { TheThingStateChangeRecordPageObjectCypress } from '@ygg/the-thing/test';
import { Comment } from '@ygg/shared/thread/core';

describe('Cancel item-transfer task', () => {
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
  const testCancelReason = `林北宋，林北is愛，愛is林北`;

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

  it('Can not cancel in states new, completed, and cancelled', () => {
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
      ImitationItemTransfer.actions['cancel']
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
      ImitationItemTransfer.actions['cancel']
    );

    // State cancelled
    testItemTransfer.setState(
      ImitationItemTransfer.stateName,
      ImitationItemTransfer.states.cancelled
    );
    theMockDatabase.insert(
      `${testItemTransfer.collection}/${testItemTransfer.id}`,
      testItemTransfer
    );
    cy.wait(1000);
    itemTransferPO.theThingPO.expectNoActionButton(
      ImitationItemTransfer.actions['cancel']
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
    itemTransferPO.theThingPO.expectActionButton(
      ImitationItemTransfer.actions['cancel']
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
    itemTransferPO.theThingPO.expectActionButton(
      ImitationItemTransfer.actions['cancel']
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
      ImitationItemTransfer.actions['cancel']
    );
  });

  it('Only giver and receiver can cancel', () => {
    logout();
    loginTestUser(testUser);
    cy.wait(1000);
    itemTransferPO.theThingPO.expectNoActionButton(
      ImitationItemTransfer.actions['cancel']
    );

    logout();
    loginTestUser(testGiver);
    cy.wait(1000);
    itemTransferPO.theThingPO.expectActionButton(
      ImitationItemTransfer.actions['cancel']
    );

    logout();
    loginTestUser(testReceiver);
    cy.wait(1000);
    itemTransferPO.theThingPO.expectActionButton(
      ImitationItemTransfer.actions['cancel']
    );
  });

  it('Cancel the item-transfer task', () => {
    itemTransferPO.theThingPO.runAction(
      ImitationItemTransfer.actions['cancel']
    );
    const dialogPO = new YggDialogPageObjectCypress();
    const stateChangeRecordPO = new TheThingStateChangeRecordPageObjectCypress(
      dialogPO.getSelector()
    );
    stateChangeRecordPO.expectVisible();
    stateChangeRecordPO.expectHint(
      `你將要更改 ${testItemTransfer.name} 的狀態： ${ImitationItemTransfer.states.consented.label} ➡ ${ImitationItemTransfer.states.cancelled.label}，請留言簡述原因。`
    );
    stateChangeRecordPO.addMessage(testCancelReason);
    dialogPO.confirm();
    emceePO.alert(
      `已取消 ${testItem.name} 的交付任務，並寄出通知給 ${testReceiver.name}，${testGiver.name}`
    );
    itemTransferPO.theThingPO.expectState(
      ImitationItemTransfer.states.cancelled
    );
    const stateChangeComment = new Comment({
      subjectId: testItemTransfer.id,
      ownerId: testReceiver.id,
      content: new Html(
        `📌 ${testReceiver.name} 更改狀態 ${ImitationItemTransfer.states.consented.label} ➡ ${ImitationItemTransfer.states.cancelled.label}說明：${testCancelReason}`
      )
    });
    itemTransferPO.threadPO.expectLatestComment(stateChangeComment);
  });

  it('Item state should back to "available"', () => {
    itemTransferPO.gotoItem();
    itemPO.expectVisible();
    itemPO.theThingPO.expectState(ImitationItem.states.available);
  });

  it('Item holder remains being giver', () => {
    itemPO.expectHolder(testGiver);
  });

  it('Receiver remains in item requesters', () => {
    itemPO.expectRequester(testReceiver, 0);
  });

  it('Should send notification about cancel to receiver', () => {
    const notification = new Notification({
      type: ItemTransferNotificationType,
      inviterId: testReceiver.id,
      inviteeId: testReceiver.id,
      email: testReceiver.email,
      mailSubject: `${testItem.name} 的交付任務已取消`,
      mailContent: `<h3>${testReceiver.name} 已取消 ${testItem.name} 的交付任務</h3><h3>原因說明：${testCancelReason}</h3><br>請點選以下網址檢視交付記錄`,
      confirmMessage: `<h3>您將前往交付記錄頁面</h3>`,
      landingUrl: `/${ImitationItemTransfer.routePath}/${testItemTransfer.id}`,
      data: {}
    });
    accountWidgetPO.expectNotification(1);
    accountWidgetPO.clickNotification();
    myNotificationsPO.expectVisible();
    myNotificationsPO.expectUnreadNotifications([notification]);
    myNotificationsPO.clickNotification(notification);
    emceePO.confirm(`您將前往交付記錄頁面`);
    itemTransferPO.expectVisible();
    itemTransferPO.theThingPO.expectValue(testItemTransfer);
    itemTransferPO.theThingPO.expectState(
      ImitationItemTransfer.states.cancelled
    );
  });

  it('Should send notification about cancel to giver', () => {
    const notification = new Notification({
      type: ItemTransferNotificationType,
      inviterId: testReceiver.id,
      inviteeId: testGiver.id,
      email: testGiver.email,
      mailSubject: `${testItem.name} 的交付任務已取消`,
      mailContent: `<h3>${testReceiver.name} 已取消 ${testItem.name} 的交付任務</h3><h3>原因說明：${testCancelReason}</h3><br>請點選以下網址檢視交付記錄`,
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
      ImitationItemTransfer.states.cancelled
    );
  });
});
