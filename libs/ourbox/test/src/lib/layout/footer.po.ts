import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class FooterPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.ourbox-footer',
    buttonGotoFeedbackList: 'button.goto-feedback-list',
    buttonGotoDebuggingPage: 'button.goto-debugging-page'
  };

  gotoDebuggingPage() {
    cy.get(this.getSelector('buttonGotoDebuggingPage')).click();
  }

  gotoFeedbackListPage() {
    cy.get(this.getSelector('buttonGotoFeedbackList')).click();
  }
}
