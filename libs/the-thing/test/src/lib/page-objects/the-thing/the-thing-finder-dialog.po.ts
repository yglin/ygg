import { TheThingFinderDialogPageObject } from '@ygg/the-thing/ui';
import { TheThingFinderPageObjectCypress } from './the-thing-finder.po';

export class TheThingFinderDialogPageObjectCypress extends TheThingFinderDialogPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.theThingFinder = new TheThingFinderPageObjectCypress(
      this.getSelector()
    );
  }

  expectVisible() {
    cy.get(this.getSelector()).should('be.visible');
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click({ force: true });
  }
}
