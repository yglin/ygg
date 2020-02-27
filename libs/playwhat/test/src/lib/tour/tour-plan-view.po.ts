import { DateRange, DayTimeRange } from '@ygg/shared/omni-types/core';
import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import { TourPlanViewPageObject } from '@ygg/playwhat/ui';
import {
  DateRangeViewPageObjectCypress,
  DayTimeRangeViewPageObjectCypress,
  ContactViewPageObjectCypress
} from '@ygg/shared/omni-types/test';
import { ImageThumbnailListPageObjectCypress } from '@ygg/shared/ui/test';
import { ImitationTourPlan } from '@ygg/playwhat/core';
import { TheThingCellViewPageObjectCypress } from '@ygg/the-thing/test';
import { PurchaseListPageObjectCypress } from '@ygg/shopping/test';

export class TourPlanViewPageObjectCypress extends TourPlanViewPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.dateRangeViewPO = new DateRangeViewPageObjectCypress(
      this.getSelector('dateRange')
    );
    this.contactViewPO = new ContactViewPageObjectCypress(
      this.getSelector('contact')
    );
    this.purchaseListPO = new PurchaseListPageObjectCypress(
      this.getSelector('purchases')
    );
  }

  expectVisible() {
    cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  expectCell(cell: TheThingCell) {
    cy.get(`${this.getSelectorForCell(cell.name)} h4`).contains(cell.name);
    const cellViewPagePO = new TheThingCellViewPageObjectCypress(
      this.getSelectorForCell(cell.name)
    );
    cellViewPagePO.expectValue(cell);
  }

  expectValue(tourPlan: TheThing) {
    cy.get(this.getSelector('name')).should('include.text', tourPlan.name);

    // const dateRange: DateRange = tourPlan.cells['預計出遊日期'].value;
    // this.dateRangeViewPO.expectValue(dateRange);

    // const dayTimeRangeViewPO = new DayTimeRangeViewPageObjectCypress(
    //   this.getSelector('dayTimeRange')
    // );
    // const dayTimeRange: DayTimeRange = tourPlan.cells['預計遊玩時間'].value;
    // dayTimeRangeViewPO.expectValue(dayTimeRange);

    // cy.get(this.getSelector('numParticipants')).should(
    //   'include.text',
    //   tourPlan.cells['預計參加人數'].value
    // );

    // const contact = tourPlan.cells['聯絡資訊'].value;
    // this.contactViewPO.expectValue(contact);

    const requiredCells = ImitationTourPlan.getRequiredCellNames();
    for (const requiredCell of requiredCells) {
      const cell = tourPlan.cells[requiredCell];
      this.expectCell(cell);
    }
    const optionalCells = ImitationTourPlan.getOptionalCellNames();
    for (const optionalCell of optionalCells) {
      if (tourPlan.hasCell(optionalCell)) {
        const cell = tourPlan.cells[optionalCell];
        this.expectCell(cell);
      }
    }
  }
}
