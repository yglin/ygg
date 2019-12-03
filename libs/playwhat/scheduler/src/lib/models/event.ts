import { extend } from 'lodash';
import * as moment from 'moment';
import * as uuid from 'uuid';
import { DataItem, toJSONDeep, generateID } from '@ygg/shared/infra/data-access';
import { Album } from '@ygg/playwhat/resource';

export class Event implements DataItem {
  id: string;
  name: string;
  description: string;
  color: string;
  album: Album;
  start: Date;
  end: Date;
  resourceId: string;

  constructor() {
    this.id = generateID();
  }

  fromJSON(data: any = {}): this {
    extend(this, data);
    if (typeof data.start === 'string') {
      this.start = new Date(data.start);
    } else {
      this.start = null;
    }
    if (typeof data.end === 'string') {
      this.end = new Date(data.end);
    } else {
      this.end = null;
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}