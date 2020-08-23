import { PageObject } from '@ygg/shared/test/page-object';
import { Notification } from '@ygg/shared/user/core';

export class NotificationItemPageObject extends PageObject {
  selectors = {
    main: '.notification-item',
    subject: '.subject'
  };
}

export abstract class MyNotificationListPageObject extends PageObject {
  selectors = {
    main: '.my-notification-list',
    unreadList: '.unread-list',
    readList: '.read-list',
    firstUnread: '.unread-list .first'
  };

  getSelectorForNotification(notification: Notification): string {
    return `${this.getSelector()} .notification:contains("${notification.mailSubject.replace(
      /(:|\.|\[|\]|,|=|@)/g,
      '\\$1'
    )}")`;
  }

  getSelectorForUnreadNotification(notification: Notification): string {
    return `${this.getSelector(
      'unreadList'
    )} .notification:contains("${notification.mailSubject.replace(
      /(:|\.|\[|\]|,|=|@)/g,
      '\\$1'
    )}")`;
  }

  getSelectorForReadNotification(notification: Notification): string {
    return `${this.getSelector(
      'readList'
    )} .notification:contains("${notification.mailSubject.replace(
      /(:|\.|\[|\]|,|=|@)/g,
      '\\$1'
    )}")`;
  }
}
