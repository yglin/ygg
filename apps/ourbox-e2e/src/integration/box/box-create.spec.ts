import {
  ImitationBox,
  ImitationItem,
  NotificationJoinBox,
  ImitationBoxFlags
} from '@ygg/ourbox/core';
import {
  BoxCreatePageObjectCypress,
  BoxViewPageObjectCypress,
  HeaderPageObjectCypress,
  ItemWarehousePageObjectCypress
} from '@ygg/ourbox/test';
import { getEnv } from '@ygg/shared/infra/core';
import {
  logout as logoutBackground,
  theMockDatabase
} from '@ygg/shared/test/cypress';
import {
  EmceePageObjectCypress,
  SideDrawerPageObjectCypress,
  YggDialogPageObjectCypress
} from '@ygg/shared/ui/test';
import { Notification, User } from '@ygg/shared/user/core';
import {
  AccountWidgetPageObjectCypress,
  loginTestUser,
  logout,
  MyNotificationListPageObjectCypress,
  testUsers
} from '@ygg/shared/user/test';
import { TheThingPageObjectCypress } from '@ygg/the-thing/test';
import { SiteNavigator } from '../../support/site-navigator';

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
  const itemPO = new TheThingPageObjectCypress('', ImitationItem);

  const testUser = testUsers[0];
  const otherUser = testUsers[1];
  const testItem01 = ImitationItem.forgeTheThing();
  testItem01.setState(ImitationItem.stateName, ImitationItem.states.available);
  const testItem02 = ImitationItem.forgeTheThing();
  testItem02.setState(ImitationItem.stateName, ImitationItem.states.available);

  before(function() {
    logoutBackground().then(() => {
      cy.wrap(testUsers).each((user: User) => {
        theMockDatabase.insert(`${User.collection}/${user.id}`, user);
      });
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
    boxCreatePO.expectStepHint(`邀請寶箱成員`);
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
    boxViewPO.theThingPO.runAction(ImitationBox.actions['create-item']);

    itemPO.expectVisible();
    itemPO.setValue(testItem01);
    itemPO.save(testItem01);
    // emceePO.confirm(`確定要儲存 ${testItem01.name} ？`);
    // emceePO.alert(`已成功儲存 ${testItem01.name}`);
    emceePO.confirm(
      `順便開放寶物 ${testItem01.name} 讓人索取嗎？開放後資料無法修改喔`
    );

    boxViewPO.expectVisible({ timeout: 20000 });
    boxViewPO.expectItem(testItem01);

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
    // Show the description of publicity
    boxCreatePO.showPublicDescription(
      ImitationBoxFlags['isPublic'].description
    );
    // Check box as public
    boxCreatePO.checkPublic();
    boxCreatePO.submit();

    emceePO.confirm(`確定要建立新的寶箱 ${testBox.name} ？`);
    emceePO.alert(`寶箱 ${testBox.name} 已建立`);

    boxViewPO.expectVisible();
    boxViewPO.theThingPO.runAction(ImitationBox.actions['create-item']);

    itemPO.expectVisible();
    itemPO.setValue(testItem02);
    itemPO.save(testItem02);
    // emceePO.confirm(`確定要儲存 ${testItem01.name} ？`);
    // emceePO.alert(`已成功儲存 ${testItem01.name}`);
    emceePO.confirm(
      `順便開放寶物 ${testItem02.name} 讓人索取嗎？開放後資料無法修改喔`
    );

    boxViewPO.expectVisible({ timeout: 20000 });
    boxViewPO.expectItem(testItem02);

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
