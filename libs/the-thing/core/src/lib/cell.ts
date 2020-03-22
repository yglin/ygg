import { extend, sample, random, keys, omit, get } from 'lodash';
import { Album, Address } from '@ygg/shared/omni-types/core';
import {
  Html,
  DateRange,
  DayTimeRange,
  Contact
} from '@ygg/shared/omni-types/core';
import { SerializableJSON, toJSONDeep } from '@ygg/shared/infra/data-access';
import { TheThingCellTypes } from './cell-type';

export class TheThingCell {
  name: string;
  type: string;
  value: any;

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
      cell.type = sample(TheThingCellTypes).id;
    }

    if (options.value) {
      cell.value = options.value;
    } else {
      cell.value = TheThingCellTypes[cell.type].forge();
    }
    return cell;
  }

  constructor(options?: any) {
    if (options) {
      this.fromJSON(options);
    }
  }

  clone(): TheThingCell {
    return new TheThingCell().fromJSON(omit(this.toJSON(), 'id'));
  }

  fromJSON(data: any): this {
    extend(this, data);
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
      case 'date-range':
        this.value = new DateRange().fromJSON(data.value);
        break;
      case 'day-time-range':
        this.value = new DayTimeRange().fromJSON(data.value);
        break;
      case 'contact':
        this.value = new Contact().fromJSON(data.value);
        break;
      default:
        // throw new Error(`Not supported cell type: ${data.type}`);
        break;
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
