import { PageObject } from '@ygg/shared/test/page-object';
import {
  DateRangeViewPageObject,
  ContactViewPageObject,
  DayTimeRangeViewPageObject
} from '@ygg/shared/omni-types/ui';
import { ImageThumbnailListPageObject } from '@ygg/shared/ui/widgets';
import { PurchaseListPageObject } from '@ygg/shopping/ui';
import { TheThing, TheThingCell, TheThingState } from '@ygg/the-thing/core';
import { DateRange, Contact } from '@ygg/shared/omni-types/core';
import { TheThingStatePageObject, TheThingPageObject } from '@ygg/the-thing/ui';

export abstract class TourPlanPageObject extends PageObject {
  selectors = {
    main: '.tour-plan',
    purchases: '.purchases',
    buttonSubmitApplication: 'button.submit-application',
    buttonAdminComplete: 'button.admin-complete',
    buttonAdminPaid: 'button.admin-paid',
    buttonCancelApplied: 'button.cancel-applied',
    buttonGotoEditOptionalCells: 'button.goto-edit-optional-cells',
    buttonImportToCart: 'button.import-to-cart',
    buttonAddCell: 'button.add-cell',
    buttonSave: 'button.save',
    editButtons: 'button.edit',
    optionals: '.optionals',
    totalCharge: '.total-charge',
    theThing: '.the-thing'
  };
  theThingPO: TheThingPageObject;
  statePO: TheThingStatePageObject;
  // dayTimeRangePO: DayTimeRangeViewPageObject;
  // dateRangeViewPO: DateRangeViewPageObject;
  // contactViewPO: ContactViewPageObject;
  // purchaseListPO: PurchaseListPageObject;

  getSelectorForCell(cellName: string): string {
    return `${this.getSelector()} [cell-name="${cellName}"]`;
  }

  getSelectorForButtonState(state: TheThingState): string {
    return `${this.getSelector()} .state [state-name="${state.name}"] button`;
  }

  getSelectorForEvent(event: TheThing): string {
    return `${this.getSelector()} .schedule .event:contains("${event.name}")`;
  }

  // setState(tourPlan: TheThing, state: TheThingState) {
  //   this.statePO.setValue(tourPlan, state);
  // }

  // expectState(state: TheThingState) {
  //   this.statePO.expectValue(state);
  // }

  // abstract setName(name: string);
  // abstract expectName(name: string);
  abstract expectVisible(): any;
  // abstract expectValue(value: TheThing): void;
  // abstract submitApplication(): void;
  // abstract adminComplete(): void;
  // abstract cancelApplied(tourPlan: TheThing): void;
  // abstract gotoEditOptionalCells(): void;
  // abstract gotoEditPurchases(): void;
  // abstract setCell(cell: TheThingCell): void;
  // abstract addOptionalCell(cell: TheThingCell): void;
  // abstract save(thing: TheThing): void;
  // abstract issueSave(thing: TheThing): void;
  // abstract alertSaved(thing: TheThing): void;
}
