import { ControlViewSwitchPageObject } from '@ygg/shared/ui/widgets';

export class ControlViewSwitchPageObjectCypress extends ControlViewSwitchPageObject {
  openControl() {
    cy.get(this.getSelector('buttonOpenControl')).click();
  }

  closeControl() {
    cy.get(this.getSelector('buttonCloseControl')).click();
  }
}
