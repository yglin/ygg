import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing } from '@ygg/the-thing/core';

export abstract class ShoppingCartEditorPageObject extends PageObject {
  selectors = {
    main: '.shopping-cart',
    purchaseList: '.purchases-table',
    totalCharge: '.total-charge',
    buttonClear: 'button.clear-all'
  };

  getSelectorForProduct(productId: string): string {
    return `${this.getSelector('purchaseList')} [product-id="${productId}"]`;
  }

  getSelectorForProductQuantityInput(productId: string): string {
    return `${this.getSelectorForProduct(productId)} .quantity input`;
  }

  abstract setQuantity(productId: string, quantity: number): void;

  // getSelectorForPurchase(purchase: Purchase): string {
  //   return `${this.getSelector('purchaseList')} [item-id="${purchase.productId}"]`;
  // }

  // getSelectorForPurchaseQuantity(purchase: Purchase): string {
  //   return `${this.getSelectorForPurchase(purchase)} .quantity`;
  // }

  // getSelectorForPurchaseTotalCharge(purchase: Purchase): string {
  //   return `${this.getSelectorForPurchase(purchase)} .price`;
  // }

  // getSelectorForPurchaseEditButton(purchase: Purchase): string {
  //   return `${this.getSelectorForPurchase(purchase)} button.edit`;
  // }

  // getSelectorForExpandButton(purchase: Purchase): string {
  //   return `${this.getSelectorForPurchase(purchase)} button.expand`;
  // }

  abstract expectProducts(theThings: TheThing[]): void;
  abstract expectTotalCharge(totalCharge: number): void;
}
