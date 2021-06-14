import { HtmlControlPageObject } from '@ygg/shared/omni-types/ui';
import { Html } from '@ygg/shared/omni-types/core';

export class HtmlControlPageObjectCypress extends HtmlControlPageObject {
  expectVisible() {
    cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  expectValue(value: Html) {
    cy.get(this.getSelector())
      .find('.ql-editor p')
      .contains(value.toText());
  }

  setValue(html: Html) {
    // XXX 2020/01/17 yglin
    // Right now I can't find any way to make cypress insert raw html into ckeditor(ver. 5)
    // So this implementation below pass the test but is eventualy wrong
    cy.get(this.getSelector())
      .find('.ql-editor p')
      .scrollIntoView()
      .should('be.visible')
      .click()
      .clear({ force: true })
      .should('have.value', '')
      .type(html.toText());
    cy.wait(1000);
  }
}
