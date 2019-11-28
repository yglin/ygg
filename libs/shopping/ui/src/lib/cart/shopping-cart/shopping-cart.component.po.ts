import { PageObject } from '@ygg/shared/test/page-object';
import { Product, Purchase } from '@ygg/shopping/core';

export class ShoppingCartPageObject extends PageObject {
  selectors = {
    main: '.shopping-cart',
    purchaseList: '.purchases-table',
    totalPrice: '.total-price',
    buttonClear: 'button.clear-all'
  };

  getSelectorForProduct(product: Product): string {
    return `${this.getSelector('purchaseList')} [product-id="${product.id}"]`;
  }

  getSelectorForPurchase(purchase: Purchase): string {
    return `${this.getSelector('purchaseList')} [item-id="${purchase.productId}"]`;
  }

  getSelectorForPurchaseQuantity(purchase: Purchase): string {
    return `${this.getSelectorForPurchase(purchase)} .quantity`;
  }

  getSelectorForPurchaseTotalPrice(purchase: Purchase): string {
    return `${this.getSelectorForPurchase(purchase)} .price`;
  }

  getSelectorForPurchaseEditButton(purchase: Purchase): string {
    return `${this.getSelectorForPurchase(purchase)} button.edit`;
  }
  
  getSelectorForExpandButton(purchase: Purchase): string {
    return `${this.getSelectorForPurchase(purchase)} button.expand`;
  }
}