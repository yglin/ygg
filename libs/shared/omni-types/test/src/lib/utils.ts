import { OmniTypeID } from '@ygg/shared/omni-types/core';
import { ViewPageObject } from '@ygg/shared/test/page-object';
import { TextViewPageObjectCypress } from './text';
import { LongTextViewPageObjectCypress } from './longtext';
import {
  DateRangeViewPageObjectCypress,
  DayTimeRangeViewPageObjectCypress,
  BusinessHoursViewPageObjectCypress,
  TimeRangeViewPageObjectCypress,
  TimeLengthViewPageObjectCypress,
  DatetimeViewPageObjectCypress
} from './datetime';
import { NumberViewPageObjectCypress } from './number';
import { ContactViewPageObjectCypress } from './contact';
import { AlbumViewPageObjectCypress } from './album';
import { LocationViewPageObjectCypress } from './location';
import { HtmlViewPageObjectCypress } from './html';

export function getViewPageObject(
  type: OmniTypeID,
  parentSelector: string
): ViewPageObject {
  let viewPO: ViewPageObject;

  switch (type) {
    case 'text':
      viewPO = new TextViewPageObjectCypress(parentSelector);
      break;
    case 'longtext':
      viewPO = new LongTextViewPageObjectCypress(parentSelector);
      break;
    case 'datetime':
      viewPO = new DatetimeViewPageObjectCypress(parentSelector);
      break;
    case 'date-range':
      viewPO = new DateRangeViewPageObjectCypress(parentSelector);
      break;
    case 'time-range':
      viewPO = new TimeRangeViewPageObjectCypress(parentSelector);
      break;
    case 'time-length':
      viewPO = new TimeLengthViewPageObjectCypress(parentSelector);
      break;
    case 'number':
      viewPO = new NumberViewPageObjectCypress(parentSelector);
      break;
    case 'contact':
      viewPO = new ContactViewPageObjectCypress(parentSelector);
      break;
    case 'day-time-range':
      viewPO = new DayTimeRangeViewPageObjectCypress(parentSelector);
      break;
    case 'album':
      viewPO = new AlbumViewPageObjectCypress(parentSelector);
      break;
    case 'location':
      viewPO = new LocationViewPageObjectCypress(parentSelector);
      break;
    case 'html':
      viewPO = new HtmlViewPageObjectCypress(parentSelector);
      break;
    case 'business-hours':
      viewPO = new BusinessHoursViewPageObjectCypress(parentSelector);
      break;
    default:
      throw new Error(
        `Can not find matched OmniTypeViewPageObject for type: ${type}`
      );
      break;
  }

  return viewPO;
}
