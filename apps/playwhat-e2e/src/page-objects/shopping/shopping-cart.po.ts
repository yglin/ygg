import { ShoppingCartPageObject } from '@ygg/shopping/ui';
import { Purchase } from '@ygg/shopping/core';

export class ShoppingCartPageObjectCypress extends ShoppingCartPageObject {
  setPurchase(purchase: Purchase) {
    cy.get(this.getSelectorForQuantityInput(purchase)).clear().type(purchase.quantity.toString());
  }

  expectPurchase(purchase: Purchase) {
    cy.get(this.getSelectorForPurchase(purchase)).should('have.attr', 'product-id', purchase.productId);
    cy.get(this.getSelectorForQuantityInput(purchase)).should('have.value', purchase.quantity);
  }
}
