import { PageObject } from '@ygg/shared/test/page-object';

export abstract class ShoppingCartButtonPageObject extends PageObject {
  selectors = {
    main: '.shopping-cart-button'
  };

  abstract expectBadge(badge: number | 'hide'): void;
}
