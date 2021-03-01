import { OmniTypeViewPageObject } from '@ygg/shared/omni-types/ui';
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
import { LocationViewPageObjectCypress } from '@ygg/shared/geography/test';
import { HtmlViewPageObjectCypress } from './html';

export class OmniTypeViewPageObjectCypress extends OmniTypeViewPageObject {
  expectValue(type: OmniTypeID, value: any): void {
    let viewPO: ViewPageObject;

    switch (type) {
      case 'text':
        viewPO = new TextViewPageObjectCypress(this.getSelector());
        break;
      case 'longtext':
        viewPO = new LongTextViewPageObjectCypress(this.getSelector());
        break;
      case 'datetime':
        viewPO = new DatetimeViewPageObjectCypress(this.getSelector());
        break;
      case 'date-range':
        viewPO = new DateRangeViewPageObjectCypress(this.getSelector());
        break;
      case 'time-range':
        viewPO = new TimeRangeViewPageObjectCypress(this.getSelector());
        break;
      case 'time-length':
        viewPO = new TimeLengthViewPageObjectCypress(this.getSelector());
        break;
      case 'number':
        viewPO = new NumberViewPageObjectCypress(this.getSelector());
        break;
      case 'contact':
        viewPO = new ContactViewPageObjectCypress(this.getSelector());
        break;
      case 'day-time-range':
        viewPO = new DayTimeRangeViewPageObjectCypress(this.getSelector());
        break;
      case 'album':
        viewPO = new AlbumViewPageObjectCypress(this.getSelector());
        break;
      case 'location':
        viewPO = new LocationViewPageObjectCypress(this.getSelector());
        break;
      case 'html':
        viewPO = new HtmlViewPageObjectCypress(this.getSelector());
        break;
      case 'business-hours':
        viewPO = new BusinessHoursViewPageObjectCypress(this.getSelector());
        break;
      default:
        throw new Error(
          `Can not find matched OmniTypeViewPageObject for type: ${type}`
        );
        break;
    }

    viewPO.expectValue(value);
  }
}
