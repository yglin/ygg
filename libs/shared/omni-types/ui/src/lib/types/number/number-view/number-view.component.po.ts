import { PageObject } from '@ygg/shared/test/page-object';

export abstract class NumberViewPageObject extends PageObject {
  selectors = {
    main: '.number-view',
    value: '.value'
  };

  abstract expectValue(value: number): void;
}
