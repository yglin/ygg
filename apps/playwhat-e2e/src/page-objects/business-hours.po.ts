import * as moment from 'moment';
import { PageObject } from "./page-object.po";
import { BusinessHours, TimeRange, OpenHour, WeekDayNames } from '@ygg/shared/types';

class WeekDaySelectPageObject extends PageObject {
  selector = '.week-day-select';
  selectors = {
    weekDaySelect: '#select'
  };

  select(weekDay: number) {
    cy.get(this.getSelector('weekDaySelect')).click();
    cy.get(`.week-day-option[weekDay=${weekDay}]`).click();
  };
}

class TimeInputPageObject extends PageObject {
  selector = '.time-input';
  selectors = {
    hourInput: 'input#hour',
    minuteInput: 'input#minute'
  }

  fillIn(time: Date) {
    cy.get(this.getSelector('hourInput')).click().type(time.getHours().toString());
    cy.get(this.getSelector('minuteInput')).click().type(time.getMinutes().toString());
  }
}

class TimeRangeControlPageObject extends PageObject {
  selector = '.time-range-control';
  selectors = {
    start: '#start',
    end: '#end'
  };

  fillIn(timeRange: TimeRange) {
    const startInput = new TimeInputPageObject(this.getSelector('start'));
    const endInput = new TimeInputPageObject(this.getSelector('end'));
    startInput.fillIn(timeRange.start);
    endInput.fillIn(timeRange.end);
  }
}

export class BusinessHoursControlPageObject extends PageObject {
  selector = '.business-hours-control';
  selectors = {
    weekDaySelect: '#week-day-select',
    timeRangeInput: '#time-range-control',
    buttonAddOpenHour: 'button#add-open-hour',
    buttonClearAll: 'button#clear-all'
  }

  fillIn(businessHours: BusinessHours) {
    for (const openHour of businessHours.getOpenHours()) {
      cy.log(`Add open-hour ${openHour.format('ddd', 'YYYY/MM/DD A h:mm')}`);
      this.addOpenHour(openHour);
    }
  }

  addOpenHour(openHour: OpenHour) {
    const weekDaySelect = new WeekDaySelectPageObject(this.getSelector('weekDaySelect'));
    const timeRangeInput = new TimeRangeControlPageObject(this.getSelector('timeRangeInput'));
    weekDaySelect.select(openHour.weekDay);
    timeRangeInput.fillIn(openHour.timeRange);
    cy.get(this.getSelector('buttonAddOpenHour')).click();
  }
}

class OpenHourPageObject extends PageObject {
  selector = '.open-hour';
  selectors = {
    weekDay: '#week-day .value',
    start: '#start.value',
    end: '#end.value'
  };

  expect(openHour: OpenHour) {
    cy.log(`Expect open-hour ${openHour.format('ddd', 'YYYY/MM/DD A h:mm')} in Element ${this.getSelector()}`);
    cy.get(this.getSelector('weekDay')).contains(WeekDayNames[openHour.weekDay]);
    cy.get(this.getSelector('start')).contains(moment(openHour.timeRange.start).format('A h:mm'));
    cy.get(this.getSelector('end')).contains(moment(openHour.timeRange.end).format('A h:mm'));
  }
}

export class BusinessHoursViewPageObject extends PageObject {
  selector = '.business-hours';
  selectors = {
    openHourList: '.open-hour-list'
  };

  expect(businessHours: BusinessHours) {
    const openHours = businessHours.getOpenHours();
    for (let index = 0; index < openHours.length; index++) {
      const openHour = openHours[index];
      const openHourPageObject = new OpenHourPageObject(`${this.getSelector('openHourList')} #open-hour-${index}`);
      openHourPageObject.expect(openHour);
    }
  }
}