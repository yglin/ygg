import { TheThingDataTablePageObject } from '@ygg/the-thing/ui';
import { TheThing } from '@ygg/the-thing/core';
import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { timeout } from 'rxjs/operators';

export class TheThingDataTablePageObjectCypress
  extends TheThingDataTablePageObject
  implements PageObjectCypress {
  expectVisible(): Cypress.Chainable<any> {
    return cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  setSearchText(text: string) {
    cy.get(this.getSelector('inputSearch'))
      .clear()
      .type(text);
  }

  expectTheThing(theThing: TheThing) {
    this.setSearchText(theThing.name);
    cy.get(`${this.getSelector()}`)
      .contains('td.name', theThing.name)
      .should('exist');
  }

  expectNotTheThing(theThing: TheThing) {
    this.setSearchText(theThing.name);
    cy.get(`${this.getSelector()} tr`)
      .contains(theThing.name)
      .should('not.exist');
  }

  expectNotEmpty() {
    cy.get(`${this.getSelector()} .row`, { timeout: 10000 }).should('exist');
  }

  expectEmpty() {
    cy.get(`${this.getSelector()} .row`, { timeout: 10000 }).should(
      'not.exist'
    );
  }

  deleteTheThing(theThing: TheThing) {
    this.setSearchText(theThing.name);
    cy.get(`${this.getSelector()}`)
      .contains('tr', theThing.name)
      .find('button.delete')
      .click();
  }

  gotoTheThingView(theThing: TheThing) {
    cy.get(`${this.getSelector()} tr`)
      .contains(theThing.name)
      .click();
  }

  gotoTheThingEdit(theThing: TheThing) {
    cy.get(this.getSelector()).contains('tr.row', theThing.name).find('button.edit').click();
  }

  expectFirst(theThing: TheThing) {
    cy.get(this.getSelectorForFirst()).contains(theThing.name);
  }

  clickFirst() {
    cy.get(this.getSelectorForFirst()).click();
  }

  select(theThings: TheThing[]) {
    cy.wrap(theThings).each((thing: any) => {
      this.setSearchText(thing.id);
      cy.get(`${this.getSelector}`)
        .contains('tr.row', thing.name)
        .find('input[type="checkbox"]')
        .click({
          multiple: true
        });
    });
  }

  selectAll() {
    cy.get(this.getSelector('checkboxSelectAll'))
      .check({ force: true })
      .should('be.checked');
  }
}
