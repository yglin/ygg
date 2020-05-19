import { PurchaseProductPageObject } from '@ygg/shopping/ui';
import { Purchase } from '@ygg/shopping/core';
import { OmniTypeViewControlPageObjectCypress } from '@ygg/shared/omni-types/test';

export class PurchaseProductPageObjectCypress extends PurchaseProductPageObject {
  setValue(purchases: Purchase[]): void {
    // cy.pause();
    for (const purchase of purchases) {
      const numberControlPO = new OmniTypeViewControlPageObjectCypress(
        `${this.getSelector()} [product-id="${purchase.productId}"] .quantity`
      );
      numberControlPO.setValue('number', purchase.quantity);
    }
  }
}
