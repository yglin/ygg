import { PageObject } from '@ygg/shared/test/page-object';
import { Product, Purchase } from '@ygg/shopping/core';

export class ShoppingCartPageObject extends PageObject {
  selectors = {
    main: '.shopping-cart',
    purchaseList: '.purchase-list',
    totalPrice: '.total-price'
  };

  getSelectorForProduct(product: Product): string {
    return `${this.getSelector('purchaseList')} [product-id="${product.id}"]`;
  }

  getSelectorForPurchase(purchase: Purchase): string {
    return `${this.getSelector('purchaseList')} [purchase-id="${purchase.id}"]`;
  }

  getSelectorForQuantityInput(purchase: Purchase): string {
    return `${this.getSelector('purchaseList')} [purchase-id="${purchase.id}"] .quantity input`;
  }
  
}