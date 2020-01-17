import { HtmlControlPageObject } from '@ygg/shared/omni-types/ui';
import { Html } from '@ygg/shared/omni-types/core';

export class HtmlControlPageObjectCypress extends HtmlControlPageObject {
  setValue(html: Html) {
    // XXX 2020/01/17 yglin
    // Right now I can't find any way to make cypress insert raw html into ckeditor(ver. 5)
    // So this implementation below pass the test but is eventualy wrong
    cy.get(this.getSelector()).find('[contenteditable=true]').type(html.content);
  }
}
