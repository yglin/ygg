import { PageObject } from '@ygg/shared/test/page-object';
import { Notification } from '@ygg/shared/user/core';

export class NotificationItemPageObject extends PageObject {
  selectors = {
    main:'.notification-item',
    subject: '.subject'
  };
}

export abstract class MyNotificationListPageObject extends PageObject {
  selectors = {
    main:'.my-notification-list',
    unreadList: '.unread-list',
    readList: '.read-list'
  };

  getSelectorForNotification(notification: Notification): string {
    return `${this.getSelector()} [notification-id="${notification.id}"]`
  }

  getSelectorForUnreadNotification(notification: Notification): string {
    return `${this.getSelector('unreadList')} [notification-id="${notification.id}"]`;
  }

  getSelectorForReadNotification(notification: Notification): string {
    return `${this.getSelector('readList')} [notification-id="${notification.id}"]`;
  }
}
