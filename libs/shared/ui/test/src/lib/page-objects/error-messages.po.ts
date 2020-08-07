import { ErrorMessagesPageObject } from '@ygg/shared/ui/widgets';
import { MaterialSnackBarPageObjectCypress } from '@ygg/shared/test/cypress';

export class ErrorMessagesPageObjectCypress extends ErrorMessagesPageObject {
  expectMessage(message: string): void {
    cy.get(this.getSelector('buttonShowErrors')).click();
    const matSnackBarPO = new MaterialSnackBarPageObjectCypress();
    matSnackBarPO.expectMessage(message);
  }
}
