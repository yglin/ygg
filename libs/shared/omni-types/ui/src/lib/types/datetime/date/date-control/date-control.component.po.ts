import { PageObject } from '@ygg/shared/test/page-object';

export abstract class DateControlPageObject extends PageObject {
  selectors = {
    main: '.date-control',
    inputDate: 'input.date'
  };

  abstract setValue(date: Date): void;
}
