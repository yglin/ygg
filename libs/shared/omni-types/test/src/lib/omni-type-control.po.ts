import { OmniTypeControlPageObject } from '@ygg/shared/omni-types/ui';
import { OmniTypeID } from '@ygg/shared/omni-types/core';
import { ControlPageObject } from '@ygg/shared/test/page-object';
import { TextControlPageObjectCypress } from './text';
import { LongTextControlPageObjectCypress } from './longtext';
import {
  DateRangeControlPageObjectCypress,
  DayTimeRangeControlPageObjectCypress,
  BusinessHoursControlPageObjectCypress,
  TimeLengthControlPageObjectCypress,
  DatetimeControlPageObjectCypress,
  TimeRangeControlPageObjectCypress
} from './datetime';
import { NumberControlPageObjectCypress } from './number';
import { ContactControlPageObjectCypress } from './contact';
import { AlbumControlPageObjectCypress } from './album';
import { LocationControlPageObjectCypress } from '@ygg/shared/geography/test';
import { HtmlControlPageObjectCypress } from './html';

export class OmniTypeControlPageObjectCypress extends OmniTypeControlPageObject {
  controlPO: ControlPageObject;

  constructor(parentSelector: string, type?: OmniTypeID) {
    super(parentSelector);
    try {
      this.controlPO = this.getTypedControlPageObject(type);
    } catch (error) {
      console.error(error.message);
    }
  }

  getTypedControlPageObject(type: OmniTypeID) {
    let controlPO: ControlPageObject;
    switch (type) {
      case 'text':
        controlPO = new TextControlPageObjectCypress(this.getSelector());
        break;
      case 'longtext':
        controlPO = new LongTextControlPageObjectCypress(this.getSelector());
        break;
      case 'datetime':
        controlPO = new DatetimeControlPageObjectCypress(this.getSelector());
        break;
      case 'date-range':
        controlPO = new DateRangeControlPageObjectCypress(this.getSelector());
        break;
      case 'time-range':
        controlPO = new TimeRangeControlPageObjectCypress(this.getSelector());
        break;
      case 'time-length':
        controlPO = new TimeLengthControlPageObjectCypress(this.getSelector());
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
    return controlPO
  }

  expectHint(hintMessage: string) {
    this.controlPO.expectHint(hintMessage);
  }

  setValue(type: OmniTypeID, value: any): void {
    if (!this.controlPO) {
      this.controlPO = this.getTypedControlPageObject(type);
    }
    this.controlPO.setValue(value);
  }
}
