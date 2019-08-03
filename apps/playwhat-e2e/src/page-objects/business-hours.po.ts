import * as moment from 'moment';
import { BusinessHours, TimeRange } from '@ygg/shared/types';

export class BusinessHoursControlPageObject {
  selector: string;
  dropdownDaySelector: string;
  inputStartTimeSelector: string;
  inputEndTimeSelector: string;
  buttonAddOpenHourSelector: string;
  buttonClearAllSelector: string;

  constructor(parentSelector: string = '') {
    this.selector = `${parentSelector} .business-hours-control`.trim();
    this.dropdownDaySelector = `${this.selector} #day-selector select`;
    this.inputStartTimeSelector = `${this.selector} #start-time input`;
    this.inputEndTimeSelector = `${this.selector} #end-time input`;
    this.buttonAddOpenHourSelector = `${this.selector} button#add-open-hour`;
    this.buttonClearAllSelector = `${this.selector} button#clear-all`;
  }

  fillIn(businessHours: BusinessHours) {
    cy.get(this.buttonClearAllSelector).click();
    for (let day = 0; day < 7; day++) {
      const openHours = businessHours.getOpenHoursByWeekday(day);
      for (const openHour of openHours) {
        this.addOpenHour(day, openHour);
      }
    }
  }

  addOpenHour(day: number, openHour: TimeRange) {
    cy.get(this.dropdownDaySelector).select(day.toString());
    cy.get(this.inputStartTimeSelector).type(moment(openHour.start).format('HH:mm'));
    cy.get(this.inputEndTimeSelector).type(moment(openHour.end).format('HH:mm'));
    cy.get(this.buttonAddOpenHourSelector).click();
  }
}

export class BusinessHoursViewPageObject {
  selector: string;
  openHoursListSelector: string;

  constructor(parentSelector: string = '') {
    this.selector = `${parentSelector} .business-hours-view`.trim();
    this.openHoursListSelector = `${this.selector} .open-hours-list`;
  }

  checkData(businessHours: BusinessHours) {
    const openHoursWeekly = businessHours.getOpenHoursWeekly();
    let weekDaySelector = '';
    for (const day in openHoursWeekly) {
      if (openHoursWeekly.hasOwnProperty(day)) {
        weekDaySelector = `${this.openHoursListSelector} [weekDay="${day}"]`;
        cy.get(weekDaySelector).should('be.visible');
        const openHours = openHoursWeekly[day];
        for (const openHour of openHours) {
          cy.get(`${weekDaySelector} .open-hour`).contains(openHour.format('HH:mm', 'HH:mm'));
        }
      }
    }
  }
}