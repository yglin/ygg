import { isEmpty } from 'lodash';
import { ShoppingCartPageObject } from '@ygg/shopping/ui';
import { Purchase } from '@ygg/shopping/core';

export class ShoppingCartPageObjectCypress extends ShoppingCartPageObject {
  clear() {
    cy.get(this.getSelector('buttonClear')).click({ force: true });
  }

  setPurchase(purchase: Purchase) {
    cy.get(this.getSelectorForQuantityInput(purchase))
      .clear()
      .type(purchase.quantity.toString());
    if (!isEmpty(purchase.children)) {
      this.expandPurchase(purchase);
      cy.wrap(purchase.children).each((childPurchase: Purchase) =>
        this.setPurchase(childPurchase)
      );
    }
  }

  expandPurchase(purchase: Purchase) {
    cy.get(this.getSelectorForExpandButton(purchase)).click();
    cy.get(this.getSelectorForPurchase(purchase)).should(
      'have.attr',
      'expanded'
    );
  }

  expectPurchases(purchases: Purchase[]) {
    cy.wrap(purchases).each((purchase: Purchase) => {
      cy.get(this.getSelectorForPurchase(purchase)).should(
        'have.attr',
        'product-id',
        purchase.productId
      );
      cy.get(this.getSelectorForQuantityInput(purchase)).should(
        'have.value',
        purchase.quantity.toString()
      );
    });
  }
}
