import { SerializableJSON, toJSONDeep } from '@ygg/shared/infra/data-access';
import { TheThingCell } from './cell';
import { extend, get } from 'lodash';
import { OmniTypes, OmniTypeID } from '@ygg/shared/omni-types/core';

type UserInputType = 'required' | 'optional' | 'hidden';

export class TheThingCellDefine implements SerializableJSON {
  name: string;
  type: OmniTypeID;
  userInput: UserInputType;

  constructor(options: any = {}) {
    this.fromJSON(options);
  }

  createCell(value?: any): TheThingCell {
    value =
      value === undefined
        ? get(OmniTypes, `${this.type}.default`, null)
        : value;
    return new TheThingCell().fromJSON({
      name: this.name,
      type: this.type,
      value: value
    });
  }

  fromJSON(data: any = {}): this {
    extend(this, data);
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
