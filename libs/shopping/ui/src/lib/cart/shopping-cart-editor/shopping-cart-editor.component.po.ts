import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing, TheThingFilter } from '@ygg/the-thing/core';
import { Purchase } from '@ygg/shopping/core';
import { IConsumer } from 'libs/shopping/core/src/lib/models/consumer';

export abstract class PurchaseRowPageObject extends PageObject {
  selectors = {
    main: '',
    inputQuantity: '.quantity input',
    charge: '.charge',
    buttonDelete: 'button.delete'
  };

  abstract expectValue(purchase: Purchase): void;
  abstract setValue(purchase: Purchase): void;
  abstract setQuantity(quantity: number): void;
}

export interface IInputShoppingCart {
  consumer?: IConsumer;
  purchases: Purchase[];
  productFilter: TheThingFilter;
}

export interface IPurchasePack {
  // things: TheThing[];
  filter: TheThingFilter;
  purchases: Purchase[];
}

export abstract class ShoppingCartEditorPageObject extends PageObject {
  selectors = {
    main: '.shopping-cart',
    purchaseList: '.purchases-table',
    totalCharge: '.total-charge',
    buttonClear: 'button.clear-all',
    buttonSubmit: 'button.submit',
    buttonAddPurchase: 'button.add-purchase',
    submitTarget: '.submit-target'
  };

  getSelectorForPurchase(purchase?: Purchase): string {
    if (purchase) {
      return `${this.getSelector('purchaseList')} [product-id="${
        purchase.productId
      }"]`;
    } else {
      return `${this.getSelector('purchaseList')} [product-id]`;
    }
  }

  getSelectorForProduct(productId: string): string {
    return `${this.getSelector('purchaseList')} [product-id="${productId}"]`;
  }

  getSelectorForProductQuantity(productId: string): string {
    return `${this.getSelectorForProduct(productId)} .quantity`;
  }

  getSelectorForProductQuantityInput(productId: string): string {
    return `${this.getSelectorForProductQuantity(productId)} input`;
  }

  abstract setQuantity(productId: string, quantity: number): void;
  abstract purchasePack(pack: IPurchasePack): void;
  abstract updatePurchases(purchases: Purchase[]): void;
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
