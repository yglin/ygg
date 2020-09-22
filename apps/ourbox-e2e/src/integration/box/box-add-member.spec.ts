import { User, Notification } from '@ygg/shared/user/core';
import { TheThing } from '@ygg/the-thing/core';
import {
  ImitationBox,
  RelationshipBoxMember,
  NotificationJoinBox,
  BoxFactory
} from '@ygg/ourbox/core';
import { SiteNavigator } from '../../support/site-navigator';
import {
  MyBoxesPageObjectCypress,
  BoxViewPageObjectCypress
} from '@ygg/ourbox/test';
import {
  logout as logoutBackground,
  theMockDatabase
} from '@ygg/shared/test/cypress';
import {
  loginTestUser,
  logout,
  AccountWidgetPageObjectCypress,
  MyNotificationListPageObjectCypress,
  UsersByEmailSelectorPageObjectCypress,
  testUsers
} from '@ygg/shared/user/test';
import {
  YggDialogPageObjectCypress,
  EmceePageObjectCypress
} from '@ygg/shared/ui/test';

describe('Adding and invite new box member', () => {
  const siteNavigator = new SiteNavigator();
  const myBoxesPO = new MyBoxesPageObjectCypress();
  const boxViewPO = new BoxViewPageObjectCypress();
  const dialogPO = new YggDialogPageObjectCypress();
  const usersByEmailSelectorPO = new UsersByEmailSelectorPageObjectCypress(
    dialogPO.getSelector()
  );
  const emceePO = new EmceePageObjectCypress();
  const accountWidgetPO = new AccountWidgetPageObjectCypress();
  const myNotificationsPO = new MyNotificationListPageObjectCypress();

  const boxOwner: User = testUsers[0]
  const boxMember1: User = testUsers[1];
  const newMember: User = testUsers[2];

  const theThings: TheThing[] = [];
  const box = ImitationBox.forgeTheThing();
  box.ownerId = boxOwner.id;
  box.setState(ImitationBox.stateName, ImitationBox.states.open);
  box.addUsersOfRole(RelationshipBoxMember.role, [boxOwner.id, boxMember1.id]);
  theThings.push(box);

  before(function() {
    logoutBackground().then(() => {
      cy.wrap(testUsers).each((user: User) => {
        theMockDatabase.insert(`${User.collection}/${user.id}`, user);
      });
      cy.wrap(theThings).each((theThing: TheThing) => {
        theMockDatabase.insert(
          `${theThing.collection}/${theThing.id}`,
          theThing
        );
      });
      cy.visit('/');
      loginTestUser(boxOwner);
      siteNavigator.gotoMyBoxes();
      myBoxesPO.expectVisible();
      myBoxesPO.gotoBox(box);
    });
  });

  after(function() {
    theMockDatabase.clear();
  });

  it('Only box owner can add member', () => {
    logout();
    loginTestUser(boxMember1);
    boxViewPO.theThingPO.expectNoActionButton(
      ImitationBox.actions['add-member']
    );
    logout();
    loginTestUser(boxOwner);
    boxViewPO.theThingPO.expectActionButton(ImitationBox.actions['add-member']);
  });

  it('Invite new box member', () => {
    const notificationBoxMemberInvite = BoxFactory.createNotificationBoxMemberInvite(
      box,
      boxOwner,
      newMember
    );
    const emailWithoutUser = `notSignUpYet@ygmail.com`;

    boxViewPO.theThingPO.runAction(ImitationBox.actions['add-member']);
    usersByEmailSelectorPO.expectVisible();
    usersByEmailSelectorPO.addEmail(newMember.email);
    usersByEmailSelectorPO.addEmail(emailWithoutUser);
    dialogPO.confirm();
    emceePO.confirm(
      `送出寶箱成員邀請給以下人員？${newMember.email} ${newMember.name}${emailWithoutUser}`
    );
    emceePO.alert(`已送出寶箱成員邀請給：${newMember.email} ${newMember.name}${emailWithoutUser}`);
    logout();
    loginTestUser(newMember);
    accountWidgetPO.expectNotification(1);
    accountWidgetPO.clickNotification();
    myNotificationsPO.expectVisible();
    myNotificationsPO.expectUnreadNotifications([notificationBoxMemberInvite]);
    myNotificationsPO.clickFirstUnreadNotification();
    emceePO.confirm(notificationBoxMemberInvite.confirmMessage);
    boxViewPO.expectVisible();
    boxViewPO.expectMember(newMember);
  });

});
