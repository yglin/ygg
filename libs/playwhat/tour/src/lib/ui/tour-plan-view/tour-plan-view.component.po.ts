import { PageObject } from '@ygg/shared/test/page-object';
import {
  DateRangeViewPageObject,
  ContactViewPageObject,
  DayTimeRangeViewPageObject
} from '@ygg/shared/omni-types/ui';
import { ImageThumbnailListPageObject } from '@ygg/shared/ui/widgets';

export class TourPlanViewPageObject extends PageObject {
  selectors = {
    main: '.tour-plan-view',
    name: '.tour-plan-name',
    // dateRange: '.date-range',
    // numParticipants: '.num-participants .number',
    // contact: '.contact',
    playList: '.play-list'
  };
  dayTimeRangePO: DayTimeRangeViewPageObject;
  dateRangeViewPO: DateRangeViewPageObject;
  contactViewPO: ContactViewPageObject;
  playListPO: ImageThumbnailListPageObject;

  getSelectorForCell(cellName: string): string {
    return `${this.getSelector()} [cell-name="${cellName}"]`;
  }
}
