import {
  MyNotificationListPageObject,
  NotificationItemPageObject
} from '@ygg/shared/user/ui';
import { Notification } from '@ygg/shared/user/core';

export class NotificationItemPageObjectCypress extends NotificationItemPageObject {
  expectValue(ntf: Notification) {
    cy.get(this.getSelector('subject')).should('include.text', ntf.mailSubject);
  }
}

export class MyNotificationListPageObjectCypress extends MyNotificationListPageObject {
  expectVisible() {
    cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  clickFirstUnreadNotification() {
    cy.get(this.getSelector('firstUnread')).click();
  }

  expectUnreadNotifications(notifications: Notification[]) {
    cy.wrap(notifications).each((ntf: Notification) => {
      const notificationItemPO = new NotificationItemPageObjectCypress(
        this.getSelectorForUnreadNotification(ntf)
      );
      notificationItemPO.expectValue(ntf);
    });
  }

  expectReadNotifications(notifications: Notification[]) {
    cy.wrap(notifications).each((ntf: Notification) => {
      const notificationItemPO = new NotificationItemPageObjectCypress(
        this.getSelectorForReadNotification(ntf)
      );
      notificationItemPO.expectValue(ntf);
    });
  }

  clickNotification(notificatoin: Notification) {
    cy.get(this.getSelectorForNotification(notificatoin)).click();
  }
}
