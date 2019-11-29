import { DayTimeViewPageObject, DayTime } from '@ygg/shared/types';

export class DayTimeViewPageObjectCypress extends DayTimeViewPageObject {
  expectValue(dayTime: DayTime) {
    cy.get(this.getSelector()).should(
      'include.text',
      dayTime.toMoment().format(DayTime.DISPLAY_FORMAT)
    );
  }
}
