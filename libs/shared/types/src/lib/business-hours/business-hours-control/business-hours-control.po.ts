import { OpenHour } from '../open-hour/open-hour';

export abstract class BusinessHoursControlPageObject {
  selectors = {
    parent: '',
    main: '.business-hours-control',
    buttonClearAll: 'button#clear-all',
    openHour: '.open-hour',
    selectWeekDay: 'select#week-day',
    inputStart: 'input#start',
    inputEnd: 'input#end',
    buttonAdd: 'button.add',
    buttonDelete: 'button.delete'
  };

  constructor(parentSelector: string = '') {
    this.selectors.parent = parentSelector;
  }

  getSelector(name): string {
    if (name in this.selectors) {
      return `${this.selectors.parent} ${this.selectors.main} ${this.selectors[name]}`;
    } else {
      return '';
    }
  }

  abstract clearAll();
  abstract getOpenHours(): OpenHour[];
  abstract addOpenHour(openHour: OpenHour);
  abstract addOpenHourForAll7Days(start: Date, end: Date);
  abstract deleteOpenHourByIndex(index: number);
}
