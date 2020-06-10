import { EmceePageObjectCypress } from '@ygg/shared/ui/test';
import { stateConfirmMessage, TheThing, TheThingState } from '@ygg/the-thing/core';
import { TheThingStatePageObject } from '@ygg/the-thing/ui';

export class TheThingStatePageObjectCypress extends TheThingStatePageObject {
  
  expectStateButton(state: TheThingState): void {
    cy.get(this.getSelectorForButtonState(state)).scrollIntoView().should('be.visible');
  }

  expectNoStateButton(state: TheThingState): void {
    cy.get(this.getSelectorForButtonState(state)).should('not.be.visible');
  }

  setValue(theThing: TheThing, state: TheThingState) {
    cy.get(this.getSelectorForButtonState(state)).click();
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(stateConfirmMessage(theThing, state));
    // const confirmDialogPO = new ConfirmDialogPageObjectCypress();
    // confirmDialogPO.expectMessage(stateConfirmMessage(theThing, state));
    // confirmDialogPO.confirm();
  }

  expectValue(state: TheThingState) {
    cy.get(this.getSelector('label')).should('have.text', state.label);
  }
}
