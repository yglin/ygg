import { extend } from 'lodash';
import * as uuid from "uuid";
import { DataItem } from '@ygg/shared/data-access';

export class Resource implements DataItem {
  id: string;
  color: string;

  constructor() {
    this.id = uuid.v4();
    this.color = getRandomColor();
  }

  fromData(data: any = {}): this {
    extend(this, data);
    return this;
  }

  toData(): any {
    return JSON.parse(JSON.stringify(this));
  }
}

// XXX For prototype
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

