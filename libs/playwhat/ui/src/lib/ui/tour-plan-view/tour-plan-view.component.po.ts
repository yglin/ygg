import { PageObject } from '@ygg/shared/test/page-object';
import {
  DateRangeViewPageObject,
  ContactViewPageObject,
  DayTimeRangeViewPageObject
} from '@ygg/shared/omni-types/ui';
import { ImageThumbnailListPageObject } from '@ygg/shared/ui/widgets';
import { PurchaseListPageObject } from '@ygg/shopping/ui';
import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import { DateRange, Contact } from '@ygg/shared/omni-types/core';

export abstract class TourPlanViewPageObject extends PageObject {
  selectors = {
    main: '.tour-plan-view',
    name: '.tour-plan-name',
    inputName: '.tour-plan-name input',
    // dateRange: '.date-range',
    // numParticipants: '.num-participants .number',
    // contact: '.contact',
    purchases: '.purchases',
    buttonSubmitApplication: 'button.submit-application',
    buttonAdminComplete: 'button.admin-complete',
    buttonAdminPaid: 'button.admin-paid',
    buttonCancelApplied: 'button.cancel-applied',
    state: '.state',
    buttonGotoEditOptionalCells: 'button.goto-edit-optional-cells',
    buttonGotoEditPurchases: 'button.goto-edit-purchases',
    buttonAddCell: 'button.add-cell',
    buttonSave: 'button.save'
  };
  dayTimeRangePO: DayTimeRangeViewPageObject;
  dateRangeViewPO: DateRangeViewPageObject;
  contactViewPO: ContactViewPageObject;
  purchaseListPO: PurchaseListPageObject;

  getSelectorForCell(cellName: string): string {
    return `${this.getSelector()} [cell-name="${cellName}"]`;
  }

  abstract setName(name: string);
  abstract expectName(name: string);
  abstract expectVisible(): any;
  abstract expectValue(value: TheThing): void;
  abstract submitApplication(): void;
  abstract adminComplete(): void;
  abstract expectState(stateLabel: string): void;
  abstract cancelApplied(): void;
  abstract gotoEditOptionalCells(): void;
  abstract gotoEditPurchases(): void;
  abstract setCellValue(cell: TheThingCell): void;
  abstract addOptionalCell(cell: TheThingCell): void;
  abstract save(): void;
}
