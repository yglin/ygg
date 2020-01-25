import { DayTime } from "@ygg/shared/omni-types/core";
import { DayTimeViewPageObject } from "@ygg/shared/omni-types/ui";


export class DayTimeViewPageObjectCypress extends DayTimeViewPageObject {
  expectValue(dayTime: DayTime) {
    cy.get(this.getSelector()).should(
      'include.text',
      dayTime.toMoment().format(DayTime.DISPLAY_FORMAT)
    );
  }
}
