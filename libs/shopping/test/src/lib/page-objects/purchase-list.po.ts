import { PurchaseListPageObject } from '@ygg/shopping/ui';
import { isEmpty, sum } from 'lodash';
import { Purchase } from '@ygg/shopping/core';

export class PurchaseListPageObjectCypress extends PurchaseListPageObject {
  expectPurchase(productId: string, quantity: number) {
    cy.get(this.getSelectorForProduct(productId))
      .find('.quantity')
      .should('include.text', quantity.toString());
  }

  expectPurchases(purchases: Purchase[]) {
    cy.wrap(purchases).each((purchase: any) => {
      this.expectPurchase(purchase.productId, purchase.quantity);
    });
    if (!isEmpty(purchases)) {
      this.expectTotalCharge(sum(purchases.map(p => p.charge)));
    } else {
      this.expectNoTotalCharge();
    }
  }

  expectNoTotalCharge() {
    cy.get(this.getSelector('totalCharge')).should('not.be.visible');
  }

  expectTotalCharge(totalPrice: number) {
    cy.get(this.getSelector('totalCharge')).should(
      'include.text',
      `NTD ${totalPrice}`
    );
  }
}
