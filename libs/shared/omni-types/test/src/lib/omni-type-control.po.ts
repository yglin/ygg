import { OmniTypeControlPageObject } from '@ygg/shared/omni-types/ui';
import { OmniTypeID } from '@ygg/shared/omni-types/core';
import { ControlPageObject } from '@ygg/shared/test/page-object';
import { TextControlPageObjectCypress } from './text';
import { LongTextControlPageObjectCypress } from './longtext';
import {
  DateRangeControlPageObjectCypress,
  DayTimeRangeControlPageObjectCypress,
  BusinessHoursControlPageObjectCypress
} from './datetime';
import { NumberControlPageObjectCypress } from './number';
import { ContactControlPageObjectCypress } from './contact';
import { AlbumControlPageObjectCypress } from './album';
import { LocationControlPageObjectCypress } from './location';
import { HtmlControlPageObjectCypress } from './html';
import { TimeRangeControlPageObjectCypress } from './datetime/time-range/time-range-control.po';

export class OmniTypeControlPageObjectCypress extends OmniTypeControlPageObject {
  setValue(type: OmniTypeID, value: any): void {
    let controlPO: ControlPageObject;
    switch (type) {
      case 'text':
        controlPO = new TextControlPageObjectCypress(this.getSelector());
        break;
      case 'longtext':
        controlPO = new LongTextControlPageObjectCypress(this.getSelector());
        break;
      case 'date-range':
        controlPO = new DateRangeControlPageObjectCypress(this.getSelector());
        break;
      case 'time-range':
        controlPO = new TimeRangeControlPageObjectCypress(this.getSelector());
        break;
      case 'number':
        controlPO = new NumberControlPageObjectCypress(this.getSelector());
        break;
      case 'contact':
        controlPO = new ContactControlPageObjectCypress(this.getSelector());
        break;
      case 'day-time-range':
        controlPO = new DayTimeRangeControlPageObjectCypress(
          this.getSelector()
        );
        break;
      case 'album':
        controlPO = new AlbumControlPageObjectCypress(this.getSelector());
        break;
      case 'location':
        controlPO = new LocationControlPageObjectCypress(this.getSelector());
        break;
      case 'html':
        controlPO = new HtmlControlPageObjectCypress(this.getSelector());
        break;
      case 'business-hours':
        controlPO = new BusinessHoursControlPageObjectCypress(
          this.getSelector()
        );
        break;
      default:
        throw new Error(
          `Can not find matched OmniTypeControlPageObject for type: ${type}`
        );
        break;
    }
    controlPO.setValue(value);
  }
}
