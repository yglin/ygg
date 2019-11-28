import { isEmpty } from 'lodash';
import { ShoppingCartPageObject } from '@ygg/shopping/ui';
import { Purchase } from '@ygg/shopping/core';
import { PurchaseControlPageObjectCypress } from './purchase';

export class ShoppingCartPageObjectCypress extends ShoppingCartPageObject {
  clear() {
    cy.get(this.getSelector('buttonClear')).click({ force: true });
  }

  setPurchase(purchase: Purchase) {
    cy.get(this.getSelectorForPurchaseEditButton(purchase)).click();
    const purchaseControlPageObject = new PurchaseControlPageObjectCypress(
      '.ygg-dialog'
    );
    purchaseControlPageObject.setValue(purchase);
    purchaseControlPageObject.submit();
    this.expectPurchase(purchase);
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click({ force: true });
  }

  // expandPurchase(purchase: Purchase) {
  //   cy.get(this.getSelectorForExpandButton(purchase)).click();
  //   cy.get(this.getSelectorForPurchase(purchase)).should(
  //     'have.attr',
  //     'expanded'
  //   );
  // }

  expectPurchase(purchase: Purchase) {
    cy.get(this.getSelectorForPurchase(purchase)).should(
      'have.attr',
      'product-id',
      purchase.productId
    );
    cy.get(this.getSelectorForPurchaseQuantity(purchase)).should(
      'include.text',
      purchase.quantity.toString()
    );
    cy.get(this.getSelectorForPurchaseTotalPrice(purchase)).should(
      'include.text',
      purchase.totalPrice
    );
  }

  expectPurchases(purchases: Purchase[]) {
    cy.wrap(purchases).each((purchase: Purchase) => this.expectPurchase(purchase));
  }

  expectTotalPrice(totalPrice: number) {
    cy.get(this.getSelector('totalPrice')).should(
      'include.text',
      totalPrice.toString()
    );
  }
}
