import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class DebuggingPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.ourbox-debugging',
    buttonAlertError: 'button.alert-error'
  };

  showErrorAlert() {
    cy.get(this.getSelector('buttonAlertError')).click();
  }
}
