import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing } from '@ygg/the-thing/core';
import { Purchase } from '@ygg/shopping/core';

export abstract class PurchaseRowPageObject extends PageObject {
  selectors = {
    main: '',
    inputQuantity: '.quantity input',
    charge: '.charge'
  };

  abstract expectValue(purchase: Purchase): void;
  abstract setValue(purchase: Purchase): void;
  abstract setQuantity(quantity: number): void;
}

export abstract class ShoppingCartEditorPageObject extends PageObject {
  selectors = {
    main: '.shopping-cart',
    purchaseList: '.purchases-table',
    totalCharge: '.total-charge',
    buttonClear: 'button.clear-all',
    buttonSubmit: 'button.submit'
  };

  getSelectorForPurchase(purchase: Purchase): string {
    return `${this.getSelector('purchaseList')} [product-id="${
      purchase.productId
    }"]`;
  }

  getSelectorForProduct(productId: string): string {
    return `${this.getSelector('purchaseList')} [product-id="${productId}"]`;
  }

  getSelectorForProductQuantityInput(productId: string): string {
    return `${this.getSelectorForProduct(productId)} .quantity input`;
  }

  abstract setQuantity(productId: string, quantity: number): void;
  abstract setPurchases(purchases: Purchase[]): void;
  abstract expectPurchases(purchases: Purchase[]): void;
  abstract submit(): void;
  
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
