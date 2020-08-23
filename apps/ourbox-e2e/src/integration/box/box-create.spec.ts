import {
  BoxCreatePageObjectCypress,
  HeaderPageObjectCypress,
  BoxViewPageObjectCypress
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
  OurBoxSideMenu,
  ImitationBox,
  RelationshipBoxMember,
  NotificationJoinBox
} from '@ygg/ourbox/core';
import { User, Notification } from '@ygg/shared/user/core';
import { RelationRecord } from '@ygg/the-thing/core';
import { last } from 'lodash';
import { getEnv } from '@ygg/shared/infra/core';

describe('Creation of box', () => {
  const accountWidgetPO = new AccountWidgetPageObjectCypress();
  const myNotificationsPO = new MyNotificationListPageObjectCypress();
  const boxCreatePO = new BoxCreatePageObjectCypress();
  const boxViewPO = new BoxViewPageObjectCypress();
  const headerPO = new HeaderPageObjectCypress();
  const sideDrawerPO = new SideDrawerPageObjectCypress();
  const emceePO = new EmceePageObjectCypress();
  const testUser = User.forge();
  const otherUser = User.forge();

  function gotoBoxCreatePage() {
    // Navigate to box-create page through side menu
    headerPO.openSideDrawer();
    sideDrawerPO.expectVisible();
    sideDrawerPO.clickLink(OurBoxSideMenu.links.boxCreate);
    boxCreatePO.expectVisible();
  }

  before(function() {
    theMockDatabase.insert(`${User.collection}/${testUser.id}`, testUser);
    theMockDatabase.insert(`${User.collection}/${otherUser.id}`, otherUser);
    cy.visit('/');
  });

  after(function() {
    theMockDatabase.clear();
  });

  it('Create a default box, private, no other members ', () => {
    const testBox = ImitationBox.forgeTheThing();
    loginTestUser(testUser);
    gotoBoxCreatePage();
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
  });

  it('Submit creation requires login', () => {
    const testBox = ImitationBox.forgeTheThing();
    logout();
    gotoBoxCreatePage();
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
    logout();
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

    loginTestUser(testUser);
    gotoBoxCreatePage();

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

    // cy.location('pathname')
    //   .should('match', /ourbox\/boxes\/.*/)
    //   .then(path => {
    //     const boxId = last(path.split('/'));
    //     if (!boxId) {
    //       throw new Error(`Not found id of created box`);
    //     }
    //     // Automatic grant otherUser to member
    //     const relationMember: RelationRecord = new RelationRecord({
    //       subjectCollection: ImitationBox.collection,
    //       subjectId: boxId,
    //       objectCollection: User.collection,
    //       objectId: otherUser.id,
    //       objectRole: RelationshipBoxMember.role
    //     });
    //     theMockDatabase.insert(
    //       `${RelationRecord.collection}/${relationMember.id}`,
    //       relationMember
    //     );
    //     boxViewPO.expectVisible();
    //     boxViewPO.expectMember(otherUser);
    //     theMockDatabase.delete(`${ImitationBox.collection}/${boxId}`);
    //   });
  });

  // it('Create a public box ', () => {});
});
