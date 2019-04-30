import { extend, isEmpty } from 'lodash';
import { DataItem } from '@ygg/shared/data-access';
import { Event } from './event';
import * as uuid from 'uuid';

export class Schedule implements DataItem {
  id: string;
  name: string;
  events: Event[];

  constructor() {
    this.id = uuid.v4();
    this.events = [];
  }

  fromData(data: any = {}): this {
    extend(this, data);
    if (!isEmpty(data.events)) {
      this.events = data.events.map(e => new Event().fromData(e));
    }
    return this;
  }

  toData(): any {
    const data = JSON.parse(JSON.stringify(this));
    if (!isEmpty(this.events)) {
      data.events = this.events.map(e => e.toData());
    }
  }
}