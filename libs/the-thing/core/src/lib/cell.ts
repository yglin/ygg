import { extend, sample, random, keys, omit, get } from 'lodash';
import {
  Album,
  Address,
  Location,
  Html,
  DateRange,
  DayTimeRange,
  Contact,
  BusinessHours,
  OmniTypeID
} from '@ygg/shared/omni-types/core';
import { OmniTypes } from '@ygg/shared/omni-types/core';

export class TheThingCell {
  name: string;
  type: OmniTypeID;
  value: any;

  static isTheThingCell(value: any): value is TheThingCell {
    return !!value && !!value.name && !!value.type;
  }

  static forge(options: any = {}): TheThingCell {
    const cell = new TheThingCell();
    if (options.name) {
      cell.name = options.name;
    } else {
      cell.name = sample([
        '身高',
        '體重',
        '性別',
        '血型',
        '售價',
        '棲息地',
        '主食',
        '喜歡',
        '天敵',
        '討厭'
      ]);
    }

    if (options.type) {
      cell.type = options.type;
    } else {
      cell.type = sample(OmniTypes).id;
    }

    if (options.value) {
      cell.value = options.value;
    } else {
      cell.value = OmniTypes[cell.type].forge();
    }
    return cell;
  }

  constructor(options?: any) {
    if (options) {
      extend(this, options);
      // this.fromJSON(options);
    }
  }

  clone(): TheThingCell {
    return new TheThingCell().fromJSON(omit(this.toJSON(), 'id'));
  }

  fromJSON(data: any): this {
    extend(this, data);
    if (data.value) {
      switch (data.type) {
        case 'album':
          this.value = new Album().fromJSON(data.value);
          break;
        case 'html':
          this.value = new Html().fromJSON(data.value);
          break;
        case 'address':
          this.value = new Address().fromJSON(data.value);
          break;
        case 'location':
          this.value = new Location().fromJSON(data.value);
          break;
        case 'date-range':
          this.value = new DateRange().fromJSON(data.value);
          break;
        case 'day-time-range':
          this.value = new DayTimeRange().fromJSON(data.value);
          break;
        case 'business-hours':
          this.value = new BusinessHours().fromJSON(data.value);
          break;
        case 'contact':
          this.value = new Contact().fromJSON(data.value);
          break;
        default:
          // throw new Error(`Not supported cell type: ${data.type}`);
          break;
      }
    }
    return this;
  }

  toJSON(): any {
    return {
      name: this.name,
      type: this.type,
      value:
        this.value && typeof this.value.toJSON === 'function'
          ? this.value.toJSON()
          : this.value
    };
  }
}
