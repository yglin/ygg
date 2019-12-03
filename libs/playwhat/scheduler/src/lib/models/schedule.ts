import { extend, isEmpty } from 'lodash';
import { DataItem, toJSONDeep, generateID } from '@ygg/shared/infra/data-access';
import { Event } from './event';
import * as uuid from 'uuid';

export class Schedule implements DataItem {
  id: string;
  name: string;
  events: Event[];

  constructor() {
    this.id = generateID();
    this.events = [];
  }

  fromJSON(data: any = {}): this {
    extend(this, data);
    if (!isEmpty(data.events)) {
      this.events = data.events.map(e => new Event().fromJSON(e));
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}