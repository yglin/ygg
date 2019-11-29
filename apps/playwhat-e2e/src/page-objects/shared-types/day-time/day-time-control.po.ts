import { DayTimeControlPageObject, DayTime } from "@ygg/shared/types";

export class DayTimeControlPageObjectCypress extends DayTimeControlPageObject {

  setValue(dayTime: DayTime) {
    cy.get(this.getSelector('inputHour')).clear().type(dayTime.hour.toString());
    cy.get(this.getSelector('inputMinute')).clear().type(dayTime.minute.toString());
  }
}