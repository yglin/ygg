import {
  ImitationItem,
  ImitationItemTransfer,
  ItemTransferNotificationType,
  RelationshipItemHolder,
  RelationshipItemRequester,
  RelationshipItemTransferGiver,
  RelationshipItemTransferItem,
  RelationshipItemTransferReceiver
} from '@ygg/ourbox/core';
import {
  ItemTransferPageObjectCypress,
  MyItemTransfersPageObjectCypress
} from '@ygg/ourbox/test';
import { Html } from '@ygg/shared/omni-types/core';
import { beforeAll, theMockDatabase } from '@ygg/shared/test/cypress';
import { Comment } from '@ygg/shared/thread/core';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';
import { Notification, User } from '@ygg/shared/user/core';
import {
  AccountWidgetPageObjectCypress,
  loginTestUser,
  logout,
  MyNotificationListPageObjectCypress,
  testUsers
} from '@ygg/shared/user/test';
import { SiteNavigator } from '../../support/site-navigator';

describe('Item-transfer consent reception', () => {
  const siteNavigator = new SiteNavigator();
  // const myHeldItemsPO = new MyHeldItemsPageObjectCypress();
  // const itemPO = new ItemPageObjectCypress();
  const itemTransferPO = new ItemTransferPageObjectCypress();
  const emceePO = new EmceePageObjectCypress();
  const accountWidgetPO = new AccountWidgetPageObjectCypress();
  const myNotificationsPO = new MyNotificationListPageObjectCypress();
  const myItemTransfersPO = new MyItemTransfersPageObjectCypress();

  const testUser = testUsers[0];
  const testGiver = testUsers[1];
  const testReceiver = testUsers[2];
  const testItem = ImitationItem.forgeTheThing();
  testItem.ownerId = testUser.id;
  testItem.setState(ImitationItem.stateName, ImitationItem.states.transfer);
  testItem.setUserOfRole(RelationshipItemHolder.role, testGiver.id);
  testItem.addUsersOfRole(RelationshipItemRequester.role, [testReceiver.id]);
  const testItemTransfer = ImitationItemTransfer.forgeTheThing();
  testItemTransfer.name = `${testGiver.name} 交付 ${testItem.name} 給 ${testReceiver.name} 的交付任務`;
  testItemTransfer.setState(
    ImitationItemTransfer.stateName,
    ImitationItemTransfer.states.waitReceiver
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

  before(() => {
    beforeAll();
    theMockDatabase.insert(`${User.collection}/${testUser.id}`, testUser);
    theMockDatabase.insert(`${User.collection}/${testGiver.id}`, testGiver);
    theMockDatabase.insert(
      `${User.collection}/${testReceiver.id}`,
      testReceiver
    );
    theMockDatabase.insert(
      `${ImitationItem.collection}/${testItem.id}`,
      testItem
    );
    theMockDatabase.insert(
      `${ImitationItemTransfer.collection}/${testItemTransfer.id}`,
      testItemTransfer
    );
    cy.visit('/');
    loginTestUser(testReceiver);
    siteNavigator.gotoMyItemTransfers();
    myItemTransfersPO.expectVisible();
    myItemTransfersPO.gotoItemTransfer(testItemTransfer);
    itemTransferPO.expectVisible();
  });

  after(() => {
    theMockDatabase.clear();
  });

  it('Can leave comments upon item-transfer in state waitReceiver', () => {
    const commentByReceiver = new Comment({
      subjectId: testItemTransfer.id,
      ownerId: testReceiver.id,
      content: new Html(
        `${testGiver.name} is a fucking loser, give me the stuff`
      )
    });
    const commentByGiver = new Comment({
      subjectId: testItemTransfer.id,
      ownerId: testGiver.id,
      content: new Html(
        `You're a fucking loser, I'll shove the stuff up your ass`
      )
    });
    itemTransferPO.threadPO.addComment(commentByReceiver);
    logout();
    loginTestUser(testGiver);
    itemTransferPO.threadPO.addComment(commentByGiver);
    siteNavigator.gotoMyItemTransfers();
    myItemTransfersPO.expectVisible();
    myItemTransfersPO.gotoItemTransfer(testItemTransfer);
    itemTransferPO.expectVisible();
    itemTransferPO.threadPO.expectComments([commentByGiver, commentByReceiver]);
  });

  it('Giver can change data in state waitReceiver', () => {
    itemTransferPO.theThingPO.expectModifiable();
    itemTransferPO.theThingPO.setValue(testItemTransferChanged);
    itemTransferPO.theThingPO.save(testItemTransferChanged);
  });

  it('Receiver can not modify the item-transfer', () => {
    logout();
    loginTestUser(testReceiver);
    siteNavigator.gotoMyItemTransfers();
    myItemTransfersPO.expectVisible();
    myItemTransfersPO.gotoItemTransfer(testItemTransfer);
    itemTransferPO.expectVisible();
    itemTransferPO.theThingPO.expectReadonly();
  });

  it('Receiver can see the change', () => {
    itemTransferPO.theThingPO.expectValue(testItemTransferChanged);
  });

  it('Receiver consent to the item-transfer', () => {
    itemTransferPO.theThingPO.runAction(
      ImitationItemTransfer.actions['consent-reception']
    );
    emceePO.confirm(`確定要依照約定前往收取寶物 ${testItem.name} 嗎？`);
    emceePO.alert(`已通知 ${testGiver.name} ，請依照約定時間地點前往進行交付`);
    itemTransferPO.theThingPO.expectState(
      ImitationItemTransfer.states.consented
    );
  });

  it('Can not modify item-transfer in state consent', () => {
    itemTransferPO.theThingPO.expectReadonly();
  });

  it('Giver should get notification about the consent', () => {
    const notification = new Notification({
      type: ItemTransferNotificationType,
      inviterId: testReceiver.id,
      inviteeId: testGiver.id,
      email: testGiver.email,
      mailSubject: `${testReceiver.name} 已確認要收取 ${testItem.name}`,
      mailContent: `${testReceiver.name} 已確認要收取 ${testItem.name}，請點選以下網址檢視交付約定的相關訊息`,
      confirmMessage: `<h3>您將前往交付通知的頁面</h3><h3>請確認相關約定事項</h3>`,
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
    emceePO.confirm(`您將前往交付通知的頁面請確認相關約定事項`);
    itemTransferPO.expectVisible();
    itemTransferPO.theThingPO.expectValue(testItemTransferChanged);
  });
});
