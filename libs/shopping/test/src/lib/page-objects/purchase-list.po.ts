import { PurchaseListPageObject } from '@ygg/shopping/ui';

export class PurchaseListPageObjectCypress extends PurchaseListPageObject {
  expectPurchase(productId: string, quantity: number) {
    cy.get(this.getSelectorForProduct(productId))
      .find('.quantity')
      .should('include.text', quantity.toString());
  }

  expectPurchases(purchases: { productId: string; quantity: number }[]) {
    cy.wrap(purchases).each((purchase: any) => {
      this.expectPurchase(purchase.productId, purchase.quantity);
    });
  }

  expectTotalCharge(totalPrice: number) {
    cy.get(this.getSelector('totalCharge')).should(
      'include.text',
      `NTD ${totalPrice}`
    );
  }
}
