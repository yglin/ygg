import { DateRange, DayTimeRange } from '@ygg/shared/omni-types/core';
import { TheThing } from '@ygg/the-thing/core';
import { TourPlanViewPageObject } from '@ygg/playwhat/tour';
import {
  DateRangeViewPageObjectCypress,
  DayTimeRangeViewPageObjectCypress
} from '@ygg/shared/omni-types/test';

export class TourPlanViewPageObjectCypress extends TourPlanViewPageObject {
  expectVisible() {
    cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  expectValue(tourPlan: TheThing) {
    cy.get(this.getSelector('name')).should('include.text', tourPlan.name);

    const dateRangeViewPO = new DateRangeViewPageObjectCypress(
      this.getSelector('dateRange')
    );
    const dateRange: DateRange = tourPlan.cells['預計出遊日期'].value;
    dateRangeViewPO.expectValue(dateRange);

    const dayTimeRangeViewPO = new DayTimeRangeViewPageObjectCypress(
      this.getSelector('dayTimeRange')
    );
    const dayTimeRange: DayTimeRange = tourPlan.cells['預計遊玩時間'].value;
    dayTimeRangeViewPO.expectValue(dayTimeRange);

    cy.get(this.getSelector('numParticipants')).should(
      'include.text',
      tourPlan.cells['預計參加人數'].value
    );
  }
}
