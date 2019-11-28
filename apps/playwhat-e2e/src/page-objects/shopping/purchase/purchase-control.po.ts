import { isEmpty } from 'lodash';
import { Purchase } from '@ygg/shopping/core';
import { PurchaseControlPageObject } from '@ygg/shopping/ui';

export class PurchaseControlPageObjectCypress extends PurchaseControlPageObject {
  setValue(purchase: Purchase) {
    cy.get(this.getSelectorForQuantityInput(purchase))
      .clear()
      .type(purchase.quantity.toString());
    if (!isEmpty(purchase.children)) {
      cy.wrap(purchase.children).each((childP: Purchase) => {
        cy.get(this.getSelectorForQuantityInput(childP))
          .clear()
          .type(purchase.quantity.toString());
      });
    }
    cy.get(this.getSelector('totalPrice')).should(
      'include.text',
      purchase.totalPrice.toString()
    );
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click();
    cy.get(this.getSelector()).should('not.be.visible');
  }
}
