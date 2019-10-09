import { PageObject } from '@ygg/shared/test/page-object';

export abstract class NumberRangeControlPageObject extends PageObject {
  selectors = {
    main: '.ygg-number-range-control',
    inputMin: '.min input',
    inputMax: '.max input'
  };
}