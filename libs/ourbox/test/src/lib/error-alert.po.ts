import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { YggDialogPageObjectCypress } from '@ygg/shared/ui/test';

export class ErrorAlertPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.ourbox-error-alert',
    buttonCreateFeedback: 'button.create-feedback'
  };

  constructor() {
    super();
    const parentDialogPO = new YggDialogPageObjectCypress();
    this.parentSelector = parentDialogPO.getSelector();
  }

  gotoFeedbackCreate() {
    cy.get(this.getSelector('buttonCreateFeedback')).click();
  }
}
