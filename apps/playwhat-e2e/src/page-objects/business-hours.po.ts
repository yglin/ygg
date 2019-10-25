import * as moment from 'moment';
import { PageObject } from "./page-object.po";
import { BusinessHours, DayTimeRange, OpenHour, WeekDayNames, DayTime } from '@ygg/shared/types';

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

class DayTimeControlPageObject extends PageObject {
  selector = '.day-time-control';
  selectors = {
    hourInput: 'input#hour',
    minuteInput: 'input#minute'
  }

  fillIn(dayTime: DayTime) {
    cy.get(this.getSelector('hourInput')).click().type(dayTime.hour.toString());
    cy.get(this.getSelector('minuteInput')).click().type(dayTime.minute.toString());
  }
}

class DayTimeRangeControlPageObject extends PageObject {
  selector = '.day-time-range-control';
  selectors = {
    start: '#start',
    end: '#end'
  };

  fillIn(dayTimeRange: DayTimeRange) {
    const startInput = new DayTimeControlPageObject(this.getSelector('start'));
    const endInput = new DayTimeControlPageObject(this.getSelector('end'));
    startInput.fillIn(dayTimeRange.start);
    endInput.fillIn(dayTimeRange.end);
  }
}

export class BusinessHoursControlPageObject extends PageObject {
  selector = '.business-hours-control';
  selectors = {
    weekDaySelect: '#week-day-select',
    dayTimeRangeInput: '#day-time-range-control',
    buttonAddOpenHour: 'button#add-open-hour',
    buttonClearAll: 'button#clear-all'
  }

  setValue(businessHours: BusinessHours) {
    cy.log(`Set business hours`);
    cy.get(this.getSelector('buttonClearAll')).click({force: true});
    cy.wrap(businessHours.getOpenHours()).each((openHour: any) => {
      cy.log(`Add open-hour ${openHour.format()}`);
      this.addOpenHour(openHour);
    });
  }

  addOpenHour(openHour: OpenHour) {
    // cy.wait(1000);
    const weekDaySelect = new WeekDaySelectPageObject(this.getSelector('weekDaySelect'));
    const dayTimeRangeInput = new DayTimeRangeControlPageObject(this.getSelector('dayTimeRangeInput'));
    weekDaySelect.select(openHour.weekDay);
    dayTimeRangeInput.fillIn(openHour.dayTimeRange);
    cy.get(this.getSelector('buttonAddOpenHour')).click();
  }
}

class OpenHourPageObject extends PageObject {
  selector = '.open-hour';
  selectors = {
    weekDay: '.week-day',
    start: '.start',
    end: '.end'
  };

  expect(openHour: OpenHour) {
    cy.log(`Expect open-hour ${openHour.format()} in Element ${this.getSelector()}`);
    cy.get(this.getSelector('weekDay')).contains(WeekDayNames[openHour.weekDay]);
    cy.get(this.getSelector('start')).contains(openHour.dayTimeRange.start.format('A h:mm'));
    cy.get(this.getSelector('end')).contains(openHour.dayTimeRange.end.format('A h:mm'));
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