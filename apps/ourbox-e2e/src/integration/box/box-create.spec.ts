import {
  BoxCreatePageObjectCypress,
  HeaderPageObjectCypress,
  BoxViewPageObjectCypress,
  ItemWarehousePageObjectCypress
} from '@ygg/ourbox/test';
import { theMockDatabase, getCurrentUser } from '@ygg/shared/test/cypress';
import { login } from '@ygg/shared/test/cypress';
import {
  waitForLogin,
  loginTestUser,
  logout,
  AccountWidgetPageObjectCypress,
  MyNotificationListPageObjectCypress
} from '@ygg/shared/user/test';
import { SiteNavigator } from '../../support/site-navigator';
import {
  SideDrawerPageObjectCypress,
  EmceePageObjectCypress
} from '@ygg/shared/ui/test';
import {
  ImitationBox,
  RelationshipBoxMember,
  NotificationJoinBox,
  ImitationItem,
  RelationshipBoxItem
} from '@ygg/ourbox/core';
import { User, Notification } from '@ygg/shared/user/core';
import { RelationRecord } from '@ygg/the-thing/core';
import { last } from 'lodash';
import { getEnv } from '@ygg/shared/infra/core';

describe('Creation of box', () => {
  const siteNavigator = new SiteNavigator();

  // page objects
  const accountWidgetPO = new AccountWidgetPageObjectCypress();
  const myNotificationsPO = new MyNotificationListPageObjectCypress();
  const boxCreatePO = new BoxCreatePageObjectCypress();
  const boxViewPO = new BoxViewPageObjectCypress();
  const headerPO = new HeaderPageObjectCypress();
  const sideDrawerPO = new SideDrawerPageObjectCypress();
  const emceePO = new EmceePageObjectCypress();
  const itemWarehousePO = new ItemWarehousePageObjectCypress();

  const testUser = User.forge();
  const otherUser = User.forge();
  const testItem01 = ImitationItem.forgeTheThing();
  testItem01.setState(ImitationItem.stateName, ImitationItem.states.available);
  const testItem02 = ImitationItem.forgeTheThing();
  testItem02.setState(ImitationItem.stateName, ImitationItem.states.available);

  before(function() {
    theMockDatabase.insert(`${User.collection}/${testUser.id}`, testUser);
    theMockDatabase.insert(`${User.collection}/${otherUser.id}`, otherUser);
    theMockDatabase.insert(
      `${ImitationItem.collection}/${testItem01.id}`,
      testItem01
    );
    theMockDatabase.insert(
      `${ImitationItem.collection}/${testItem02.id}`,
      testItem02
    );
    cy.visit('/');
  });

  after(function() {
    theMockDatabase.clear();
  });

  beforeEach(function() {
    loginTestUser(testUser);
    siteNavigator.gotoBoxCreatePage();
  });

  afterEach(function() {
    logout();
  });

  it('Create a default box, private, no other members ', () => {
    const testBox = ImitationBox.forgeTheThing();
    // Step: Name input
    boxCreatePO.inputName(testBox.name);
    boxCreatePO.nextStep();

    // Step Select image
    // Do nothing
    boxCreatePO.nextStep();

    // Step: Add members by emails
    // Do nothing
    boxCreatePO.nextStep();

    // Step: Select public or private
    // Do nothing
    boxCreatePO.submit();

    emceePO.confirm(`確定要建立新的寶箱 ${testBox.name} ？`);
    emceePO.alert(`寶箱 ${testBox.name} 已建立`);

    boxViewPO.expectVisible();
    boxViewPO.expectValue(testBox);
    boxViewPO.expectMember(testUser);
    boxViewPO.expectImage(ImitationBox.image);
  });

  it('Create a box with selected image', () => {
    const testBox = ImitationBox.forgeTheThing();
    const testImageSrc = '/assets/images/box/thumbnails/03.png';
    // Step: Name input
    boxCreatePO.inputName(testBox.name);
    boxCreatePO.nextStep();

    // Step Select image
    boxCreatePO.selectImage(testImageSrc);
    boxCreatePO.nextStep();

    // Step: Add members by emails
    // Do nothing
    boxCreatePO.nextStep();

    // Step: Select public or private
    // Do nothing
    boxCreatePO.submit();

    emceePO.confirm(`確定要建立新的寶箱 ${testBox.name} ？`);
    emceePO.alert(`寶箱 ${testBox.name} 已建立`);

    boxViewPO.expectVisible();
    boxViewPO.expectValue(testBox);
    boxViewPO.expectMember(testUser);
    boxViewPO.expectImage(testImageSrc);
  });

  it('Create a box with custom image', () => {
    const testBox = ImitationBox.forgeTheThing();
    const testImageSrc = 'https://i.imgur.com/scBJrge.jpg';
    // Step: Name input
    boxCreatePO.inputName(testBox.name);
    boxCreatePO.nextStep();

    // Step Select image
    boxCreatePO.selectCustomImage(testImageSrc);
    boxCreatePO.nextStep();

    // Step: Add members by emails
    // Do nothing
    boxCreatePO.nextStep();

    // Step: Select public or private
    // Do nothing
    boxCreatePO.submit();

    emceePO.confirm(`確定要建立新的寶箱 ${testBox.name} ？`);
    emceePO.alert(`寶箱 ${testBox.name} 已建立`);

    boxViewPO.expectVisible();
    boxViewPO.expectValue(testBox);
    boxViewPO.expectMember(testUser);
    boxViewPO.expectImage(testImageSrc);
  });

  it('Submit creation requires login', () => {
    const testBox = ImitationBox.forgeTheThing();
    logout();
    // Step: Name input
    boxCreatePO.inputName(testBox.name);
    boxCreatePO.nextStep();

    // Step Select image
    // Do nothing
    boxCreatePO.nextStep();

    // Step: Add members by emails
    // Do nothing
    boxCreatePO.nextStep();

    // Step: Select public or private
    // Do nothing
    boxCreatePO.submit();

    // The login dialog should show up
    loginTestUser(testUser, { openLoginDialog: false });
    emceePO.confirm(`確定要建立新的寶箱 ${testBox.name} ？`);
    emceePO.alert(`寶箱 ${testBox.name} 已建立`);

    boxViewPO.expectVisible();
    boxViewPO.expectValue(testBox);
    boxViewPO.expectMember(testUser);
  });

  it('Create a box with other members invited', () => {
    const testBox = ImitationBox.forgeTheThing();
    const notificationBoxMemberInvite = new Notification({
      type: NotificationJoinBox.type,
      inviterId: testUser.id,
      inviteeId: otherUser.id,
      email: otherUser.email,
      mailSubject: `${getEnv('siteConfig.title')}：邀請您加入寶箱${
        testBox.name
      }`,
      mailContent: `<pre><b>${testUser.name}</b>邀請您加入他的寶箱<b>${testBox.name}</b>，共享寶箱內的所有寶物</pre>`,
      confirmMessage: `${testUser.name} 邀請您，是否要加入我們的寶箱：${testBox.name}？`,
      landingUrl: `/${ImitationBox.routePath}/${testBox.id}`,
      data: {
        boxId: testBox.id
      }
    });

    // Step: Name input
    boxCreatePO.inputName(testBox.name);
    boxCreatePO.nextStep();

    // Step Select image
    // Do nothing
    boxCreatePO.nextStep();

    // Step: Add members by emails
    boxCreatePO.addMemberEmail(otherUser.email);
    boxCreatePO.nextStep();

    // Step: Select public or private
    // Do nothing
    boxCreatePO.submit();

    emceePO.confirm(
      `確定要建立新的寶箱 ${testBox.name} ？將會寄出加入邀請信給以下信箱${otherUser.email}`
    );
    emceePO.alert(
      `寶箱 ${testBox.name} 已建立已送出寶箱成員的邀請給以下email：${otherUser.email}`
    );

    // Login as other user
    logout();
    loginTestUser(otherUser);

    accountWidgetPO.expectNotification(1);
    accountWidgetPO.clickNotification();
    myNotificationsPO.expectVisible();
    myNotificationsPO.expectUnreadNotifications([notificationBoxMemberInvite]);
    myNotificationsPO.clickFirstUnreadNotification();
    emceePO.confirm(notificationBoxMemberInvite.confirmMessage);
    boxViewPO.expectVisible();
    boxViewPO.expectMember(otherUser);
  });

  it('Items of private box should be visible only to members', () => {
    const testBox = ImitationBox.forgeTheThing();
    // Step: Name input
    boxCreatePO.inputName(testBox.name);
    boxCreatePO.nextStep();

    // Step Select image
    // Do nothing
    boxCreatePO.nextStep();

    // Step: Add members by emails
    // Do nothing
    boxCreatePO.nextStep();

    // Step: Select public or private
    boxCreatePO.submit();

    emceePO.confirm(`確定要建立新的寶箱 ${testBox.name} ？`);
    emceePO.alert(`寶箱 ${testBox.name} 已建立`);

    boxViewPO.expectVisible();
    cy.location('pathname').then((path: string) => {
      const boxId = last(path.split('/'));
      if (!boxId) {
        throw new Error(`Can not find box id in url pathname`);
      }
      const relationRecord = new RelationRecord({
        subjectCollection: ImitationBox.collection,
        subjectId: boxId,
        objectCollection: ImitationItem.collection,
        objectId: testItem01.id,
        objectRole: RelationshipBoxItem.role
      });
      theMockDatabase.insert(
        `${RelationRecord.collection}/${relationRecord.id}`,
        relationRecord
      );

      // Can see the item as box member
      siteNavigator.gotoItemWarehouse();
      itemWarehousePO.expectItem(testItem01);

      // Login as other user, which is not box member
      logout();
      loginTestUser(otherUser);

      // Can not see the item as not member
      // siteNavigator.gotoItemWarehouse();
      itemWarehousePO.expectNotItem(testItem01);
    });
  });

  it('Items of public box should be visible to anyone', () => {
    const testBox = ImitationBox.forgeTheThing();
    // Step: Name input
    boxCreatePO.inputName(testBox.name);
    boxCreatePO.nextStep();

    // Step Select image
    // Do nothing
    boxCreatePO.nextStep();

    // Step: Add members by emails
    // Do nothing
    boxCreatePO.nextStep();

    // Step: Select public or private
    // Check box as public
    boxCreatePO.checkPublic();
    boxCreatePO.submit();

    emceePO.confirm(`確定要建立新的寶箱 ${testBox.name} ？`);
    emceePO.alert(`寶箱 ${testBox.name} 已建立`);

    boxViewPO.expectVisible();
    cy.location('pathname').then((path: string) => {
      const boxId = last(path.split('/'));
      if (!boxId) {
        throw new Error(`Can not find box id in url pathname`);
      }
      const relationRecord = new RelationRecord({
        subjectCollection: ImitationBox.collection,
        subjectId: boxId,
        objectCollection: ImitationItem.collection,
        objectId: testItem02.id,
        objectRole: RelationshipBoxItem.role
      });
      theMockDatabase.insert(
        `${RelationRecord.collection}/${relationRecord.id}`,
        relationRecord
      );

      // Can see the item as box member
      siteNavigator.gotoItemWarehouse();
      itemWarehousePO.expectItem(testItem02);

      // Logout as guest
      logout();
      cy.wait(3000);

      // Can see the item as guest
      itemWarehousePO.expectItem(testItem02);

      // Login as other user, which is not box member
      loginTestUser(otherUser);
      cy.wait(3000);

      // Can see the item as not box member
      itemWarehousePO.expectItem(testItem02);
    });
  });
});
