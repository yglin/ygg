import { Html } from "@ygg/shared/omni-types/core";
import { HtmlViewPageObject } from "@ygg/shared/omni-types/ui";

export class HtmlViewPageObjectCypress extends HtmlViewPageObject {
  expectValue(html: Html) {
    cy.get(this.getSelector('content')).should('include.html', html.content);
  }
}