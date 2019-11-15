import { Product, Purchase } from '@ygg/shopping/core';
import { PurchaseListPageObject } from '@ygg/shopping/ui';

export class PurchaseListPageObjectCypress extends PurchaseListPageObject {
  expectProducts(products: Product[]) {
    cy.wrap(products).each((product: Product) => {
      cy.get(this.getSelectorForProduct(product)).should('exist');
    });
  }

  expectPurchases(purchases: Purchase[]) {
    cy.wrap(purchases).each((purchase: Purchase) => {
      cy.get(this.getSelectorForPurchase(purchase))
        .should('exist');
    });
  }

  expectTotalPrice(totalPrice: number) {
    cy.get(this.getSelector('totalPrice')).should(
      'include.text',
      totalPrice.toString()
    );
  }
}
