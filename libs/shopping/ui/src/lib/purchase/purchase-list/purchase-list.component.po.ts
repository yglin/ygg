import { PageObject } from '@ygg/shared/test/page-object';
import { Purchase } from '@ygg/shopping/core';
import { TheThing } from '@ygg/the-thing/core';

export abstract class PurchaseListPageObject extends PageObject {
  selectors = {
    main: '.purchase-list',
    list: '.list',
    totalCharge: '.total-charge'
  };

  getSelectorForProduct(productId: TheThing | string): string {
    if (typeof productId !== 'string') {
      productId = productId.id;
    }
    return `${this.getSelector('list')} [product-id="${productId}"]`;
  }

  abstract expectPurchases(
    purchases: { productId: string; quantity: number }[]
  ): void;
  abstract expectTotalCharge(totalPrice: number): void;
  // getSelectorForPurchase(purchase: Purchase): string {
  //   return `${this.getSelector('list')} [product-id="${purchase.productId}"]`;
  // }
}
