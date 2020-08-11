import { ViewPageObject } from '@ygg/shared/test/page-object';

export abstract class TimeLengthViewPageObject extends ViewPageObject {
  selectors = {
    main: '.time-length-view',
    value: '.value'
  };
}
