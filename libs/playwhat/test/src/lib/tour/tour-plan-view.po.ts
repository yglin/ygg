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

  expectName(name: string) {
    cy.get(this.getSelector('name')).should('include.text', name);
  }

  expectCell(cell: TheThingCell) {
    cy.get(`${this.getSelectorForCell(cell.name)} h4`).contains(cell.name);
    const cellViewPagePO = new TheThingCellViewPageObjectCypress(
      this.getSelectorForCell(cell.name)
    );
    cellViewPagePO.expectValue(cell);
  }

  expectValue(tourPlan: TheThing) {
    this.expectName(tourPlan.name);
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
