import { PageObject } from '@ygg/shared/test/page-object';
import {
  DateRangeViewPageObject,
  ContactViewPageObject
} from '@ygg/shared/omni-types/ui';
import { ImageThumbnailListPageObject } from '@ygg/shared/ui/widgets';

export class TourPlanViewPageObject extends PageObject {
  selectors = {
    main: '.tour-plan-view',
    name: '.name',
    dateRange: '.date-range',
    // dayTimeRange: '.day-time-range',
    numParticipants: '.num-participants .number',
    contact: '.contact',
    playList: '.play-list'
  };

  dateRangeViewPO: DateRangeViewPageObject;
  contactViewPO: ContactViewPageObject;
  playListPO: ImageThumbnailListPageObject;
}
