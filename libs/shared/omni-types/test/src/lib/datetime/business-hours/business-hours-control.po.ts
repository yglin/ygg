import { BusinessHoursControlPageObject } from '@ygg/shared/omni-types/ui';
import { BusinessHours, OpenHour } from '@ygg/shared/omni-types/core';
import { DayTimeRangeControlPageObjectCypress } from '../day-time-range';

export class BusinessHoursControlPageObjectCypress extends BusinessHoursControlPageObject {
  setValue(businessHours: BusinessHours) {
    cy.get(this.getSelector('buttonClearAll')).click({ force: true });
    cy.wrap(businessHours.getOpenHours()).each((openHour: any) => {
      // cy.log(`Add open-hour ${openHour.format()}`);
      this.addOpenHour(openHour);
    });
  }

  selectWeekDay(weekDay: number) {
    cy.get(this.getSelector('selectWeekday')).click();
    cy.get(`.option-weekday[weekday="${weekDay}"]`).click();
  }

  addOpenHour(openHour: OpenHour) {
    // cy.wait(1000);
    console.dir(openHour);
    this.selectWeekDay(openHour.weekDay);
    const dayTimeRangeControlPO = new DayTimeRangeControlPageObjectCypress(
      this.getSelector('inputDayTimeRange')
    );
    dayTimeRangeControlPO.setValue(openHour.dayTimeRange);
    cy.get(this.getSelector('buttonAdd')).click();
  }
}
