import {
  ImitationItem,
  ImitationItemTransfer,
  RelationshipItemHolder,
  RelationshipItemRequester
} from '@ygg/ourbox/core';
import {
  ItemPageObjectCypress,
  ItemTransferPageObjectCypress,
  MyHeldItemsPageObjectCypress,
  MyItemTransfersPageObjectCypress
} from '@ygg/ourbox/test';
import { Html } from '@ygg/shared/omni-types/core';
import {
  logout as logoutBackground,
  theMockDatabase
} from '@ygg/shared/test/cypress';
import { Comment } from '@ygg/shared/thread/core';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';
import { User } from '@ygg/shared/user/core';
import {
  AccountWidgetPageObjectCypress,
  loginTestUser,
  logout,
  MyNotificationListPageObjectCypress
} from '@ygg/shared/user/test';
import { RelationRecord } from '@ygg/the-thing/core';
import { SiteNavigator } from '../../support/site-navigator';

describe('Item-transfer editing', () => {
  const siteNavigator = new SiteNavigator();
  const myHeldItemsPO = new MyHeldItemsPageObjectCypress();
  const itemPO = new ItemPageObjectCypress();
  const itemTransferPO = new ItemTransferPageObjectCypress();
  const emceePO = new EmceePageObjectCypress();
  const accountWidgetPO = new AccountWidgetPageObjectCypress();
  const myNotificationsPO = new MyNotificationListPageObjectCypress();
  const myItemTransfersPO = new MyItemTransfersPageObjectCypress();

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
  const testItemTransfer = ImitationItemTransfer.forgeTheThing();
  testItemTransfer.name = `${testHolder.name} 交付 ${testItem.name} 給 ${testRequester.name} 的交付任務`;
  const testItemTransferChanged = ImitationItemTransfer.forgeTheThing();
  testItemTransferChanged.name = testItemTransfer.name;

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

  it('Create the item-transfer but stay in state editing', () => {
    itemPO.theThingPO.runAction(ImitationItem.actions['transfer-next']);
    emceePO.confirm(`要將 ${testItem.name} 交付給 ${testRequester.name} ？`);
    itemTransferPO.expectVisible();
    itemTransferPO.theThingPO.expectName(testItemTransfer.name);
    itemTransferPO.expectGiver(testHolder);
    itemTransferPO.expectReceiver(testRequester);
    itemTransferPO.theThingPO.setValue(testItemTransfer);
    itemTransferPO.theThingPO.save(testItemTransfer);
    emceePO.cancel(
      `確認約定時間和地點無誤，送出交付請求給 ${testRequester.name}？`
    );
    itemPO.expectVisible();
    itemPO.theThingPO.expectState(ImitationItem.states.transfer);
    itemPO.theThingPO.runAction(ImitationItem.actions['check-item-transfer']);
    itemTransferPO.expectVisible();
    itemTransferPO.theThingPO.expectState(ImitationItemTransfer.states.editing);
  });

  it('Change some data of item-transfer', () => {
    itemTransferPO.theThingPO.setValue(testItemTransferChanged);
    itemTransferPO.theThingPO.save(testItemTransferChanged);
    siteNavigator.gotoMyItemTransfers();
    myItemTransfersPO.expectVisible();
    myItemTransfersPO.gotoItemTransfer(testItemTransferChanged);
    itemTransferPO.expectVisible();
    itemTransferPO.theThingPO.expectValue(testItemTransferChanged);
  });

  it('Can leave comments in state editing', () => {
    const newCommentByGiver = new Comment({
      subjectId: 'No matter',
      ownerId: testHolder.id,
      content: new Html(
        `You have a delivery of my love, Please receive it at specified time and location`
      )
    });
    const newCommentByReceiver = new Comment({
      subjectId: 'No matter',
      ownerId: testRequester.id,
      content: new Html(
        `Can you delivery it to my place?By the way, I would like some baloney pizza, you can take one piece on the way here`
      )
    });
    itemTransferPO.threadPO.addComment(newCommentByGiver);
    itemTransferPO.threadPO.expectLatestComment(newCommentByGiver);
    logout();
    loginTestUser(testRequester);
    itemTransferPO.threadPO.addComment(newCommentByReceiver);
    itemTransferPO.threadPO.expectLatestComment(newCommentByReceiver);
    logout();
    loginTestUser(testHolder);
    siteNavigator.gotoMyItemTransfers();
    myItemTransfersPO.expectVisible();
    myItemTransfersPO.gotoItemTransfer(testItemTransferChanged);
    itemTransferPO.expectVisible();
    itemTransferPO.threadPO.expectComments([
      newCommentByReceiver,
      newCommentByGiver
    ]);
  });
});
