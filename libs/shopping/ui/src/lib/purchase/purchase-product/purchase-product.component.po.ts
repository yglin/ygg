import { PageObject } from '@ygg/shared/test/page-object';
import { Purchase } from '@ygg/shopping/core';
import { TheThing } from '@ygg/the-thing/core';

export interface PurchaseProductComponentInput {
  purchases: Purchase[];
}

export abstract class PurchaseProductPageObject extends PageObject {
  selectors = {
    main: '.purchase-product'
  };

  abstract setValue(purchases: Purchase[]): void;
}
