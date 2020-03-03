import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing } from '@ygg/the-thing/core';

export abstract class AdditionViewPageObject extends PageObject {
  selectors = {
    main: '.addition-view',
    name: '.name',
    stock: '.stock',
    price: '.price'
  };
  abstract expectValue(addition: TheThing): void;
}
