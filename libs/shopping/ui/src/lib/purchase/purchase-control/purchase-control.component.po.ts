import { PageObject } from '@ygg/shared/test/page-object';
import { Purchase } from '@ygg/shopping/core';

export class PurchaseControlPageObject extends PageObject {
  selectors = {
    main: '.purchase-control',
    purchaseList: '.purchases-table',
    totalPrice: '.total-price',
    buttonSubmit: 'button.submit'
  };

  getSelectorForPurchase(purchase: Purchase): string {
    return `${this.getSelector()} [product-id="${purchase.productId}"]`;
  }

  getSelectorForQuantityInput(purchase: Purchase): string {
    return `${this.getSelectorForPurchase(purchase)} .quantity input`;
  }
}
