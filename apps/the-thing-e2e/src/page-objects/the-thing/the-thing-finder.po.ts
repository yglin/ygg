import { TheThing } from '@ygg/the-thing/core';
import { TheThingFinderPageObject } from '@ygg/the-thing/ui';
import { ChipsControlPageObjectCypress } from '@ygg/shared/test/cypress';

export class TheThingFinderPageObjectCypress extends TheThingFinderPageObject {
  find(theThing: TheThing) {
    const chipsControlPO = new ChipsControlPageObjectCypress(
      this.getSelector('tagsFilter')
    );
    chipsControlPO.setValue(theThing.tags.toNameArray());
    cy.get(this.getSelector('inputSearchName'))
      .clear({ force: true })
      .type(theThing.name);
    cy.get(this.getSelectorForTheThing(theThing), { timeout: 20000 }).should(
      'be.exist'
    );
  }

  select(theThing: TheThing) {
    this.find(theThing);
    cy.get(this.getSelectorForTheThing(theThing)).click({ force: true });
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click({ force: true });
  }
}
