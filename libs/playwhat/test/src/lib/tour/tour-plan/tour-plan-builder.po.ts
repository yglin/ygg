import { TourPlanBuilderPageObject } from '@ygg/playwhat/ui';
import { TheThing } from '@ygg/the-thing/core';
import { ImageThumbnailListPageObjectCypress } from '@ygg/shared/ui/test';
import { DateRange } from '@ygg/shared/omni-types/core';
import {
  DateRangeControlPageObjectCypress,
  NumberControlPageObjectCypress,
  ContactControlPageObjectCypress
} from '@ygg/shared/omni-types/test';
import { ShoppingCartEditorPageObjectCypress } from "@ygg/shopping/test";
import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { TheThingCellsEditorPageObjectCypress } from '@ygg/the-thing/test';

export class TourPlanBuilderPageObjectCypress extends TourPlanBuilderPageObject
  implements PageObjectCypress {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.playListPO = new ImageThumbnailListPageObjectCypress(
      this.getSelector('playList')
    );
    this.dateRangeControl = new DateRangeControlPageObjectCypress(
      this.getSelector('dateRangeControl')
    );
    this.numParticipantsControl = new NumberControlPageObjectCypress(
      this.getSelector('numParticipantsControl')
    );
    this.contactControlPO = new ContactControlPageObjectCypress(
      this.getSelector('contactControl')
    );
    this.theThingCellsEditorPO = new TheThingCellsEditorPageObjectCypress(
      this.getSelector('optionalCellsEditor')
    );
    this.cartEditorPO = new ShoppingCartEditorPageObjectCypress(
      this.getSelector('shoppingCart')
    );
  }

  reset() {
    this.currentStep = 1;
  }

  expectVisible(): Cypress.Chainable<any> {
    return cy.get(this.getSelector()).should('be.visible');
  }

  expectStep(step: number) {
    cy.get(this.getSelectorForStep(step)).should('be.visible');
  }

  selectPlays(plays: TheThing[]) {
    // this.clearSelectedPlays();
    cy.wrap(plays).each((play: any) => {
      this.selectPlay(play);
    });
  }

  next() {
    cy.get(`${this.getSelectorForStep(this.currentStep)} button.next`).click();
    this.currentStep += 1;
  }

  submit() {
    cy.get(`${this.getSelector('buttonSubmit')}`).click();
  }
}
