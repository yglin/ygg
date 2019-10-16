import { NumberRange } from './number-range';
import { PageObject } from '@ygg/shared/test/page-object';

export abstract class NumberRangeViewPageObject extends PageObject {
  selectors = {
    main: '.ygg-number-range',
    min: '.min',
    max: '.max'
  }

  abstract expectValue(value: NumberRange): any;
}