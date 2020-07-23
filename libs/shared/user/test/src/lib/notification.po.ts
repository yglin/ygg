import { NotificationPageObject } from '@ygg/shared/user/ui';
import { Notification } from '@ygg/shared/user/core';

export class NotificationPageObjectCypress extends NotificationPageObject {
  expectVisible() {
    cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  expectValue(notification: Notification) {
    cy.get(this.getSelector('subject')).should(
      'include.text',
      notification.mailSubject
    );
    cy.get(this.getSelector('content')).should(
      'include.html',
      notification.mailContent
    );
    cy.get(this.getSelector('landingUrl'))
      .invoke('attr', 'href')
      .should('equal', notification.landingUrl);
  }
}
