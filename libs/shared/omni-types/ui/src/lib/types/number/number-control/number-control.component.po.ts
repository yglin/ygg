import { PageObject } from '@ygg/shared/test/page-object';

export abstract class NumberControlPageObject extends PageObject {
  selectors = {
    main:'.ygg-number-control',
    numberInput: '.number-input input'
  };

  abstract setValue(value: number): void;
}