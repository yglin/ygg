import { SerializableJSON, toJSONDeep } from '@ygg/shared/infra/data-access';
import { TheThingCell } from './cell';
import { extend, get } from 'lodash';
import { OmniTypes, OmniTypeID } from '@ygg/shared/omni-types/core';

type UserInputType = 'required' | 'optional' | 'hidden';

export class TheThingCellDefine implements SerializableJSON {
  name: string;
  type: OmniTypeID;
  userInput: UserInputType;

  static isTheThingCellDefine(value: any): value is TheThingCellDefine {
    if (!(value && value.name && value.type)) {
      console.warn(`Not a valid TheThingCellDefine: ${value}`);
      return false;
    }
    return true;
  }

  constructor(options: {
    name: string;
    type: OmniTypeID;
    userInput?: UserInputType;
  }) {
    this.userInput = 'optional';
    extend(this, options);
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
