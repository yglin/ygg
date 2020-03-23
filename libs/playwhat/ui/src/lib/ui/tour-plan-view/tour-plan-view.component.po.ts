import { PageObject } from '@ygg/shared/test/page-object';
import {
  DateRangeViewPageObject,
  ContactViewPageObject,
  DayTimeRangeViewPageObject
} from '@ygg/shared/omni-types/ui';
import { ImageThumbnailListPageObject } from '@ygg/shared/ui/widgets';
import { PurchaseListPageObject } from '@ygg/shopping/ui';
import { TheThing } from '@ygg/the-thing/core';

export abstract class TourPlanViewPageObject extends PageObject {
  selectors = {
    main: '.tour-plan-view',
    name: '.tour-plan-name',
    // dateRange: '.date-range',
    // numParticipants: '.num-participants .number',
    // contact: '.contact',
    purchases: '.purchases',
    buttonSubmitApplication: 'button.submit-application',
    buttonAdminComplete: 'button.admin-complete',
    buttonAdminPaid: 'button.admin-paid'
  };
  dayTimeRangePO: DayTimeRangeViewPageObject;
  dateRangeViewPO: DateRangeViewPageObject;
  contactViewPO: ContactViewPageObject;
  purchaseListPO: PurchaseListPageObject;

  getSelectorForCell(cellName: string): string {
    return `${this.getSelector()} [cell-name="${cellName}"]`;
  }

  abstract expectVisible(): any;
  abstract expectValue(value: TheThing, options: any): void;
  abstract submitApplication(): void;
  abstract adminComplete(): void;
}
