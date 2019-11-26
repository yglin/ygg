import { sum, isEmpty } from "lodash";
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
        if (!isEmpty(purchase.children)) {
          this.expectPurchases(purchase.children);
        }
    });
    this.expectTotalPrice(sum(purchases.map(p => p.price)))
  }

  expectTotalPrice(totalPrice: number) {
    cy.log(`Expect total price = ${totalPrice}`);
    cy.get(this.getSelector('totalPrice')).should(
      'include.text',
      totalPrice.toString()
    );
  }
}