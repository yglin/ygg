import { SerializableJSON, toJSONDeep } from '@ygg/shared/infra/core';
import { TheThingCell } from './cell';
import { extend, get, mapValues } from 'lodash';
import { OmniTypes, OmniTypeID } from '@ygg/shared/omni-types/core';

type UserInputType = 'required' | 'optional' | 'hidden';

export class TheThingCellDefine {
  id: string;
  label: string;
  type: OmniTypeID;
  userInput: UserInputType;

  static isTheThingCellDefine(value: any): value is TheThingCellDefine {
    if (!(value && value.id && value.label && value.type)) {
      // console.warn(`Not a valid TheThingCellDefine: ${value}`);
      return false;
    }
    return true;
  }

  constructor(options: {
    id: string;
    label: string;
    type: OmniTypeID | string;
    userInput?: UserInputType;
  }) {
    this.userInput = 'optional';
    extend(this, options);
  }

  clone(): TheThingCellDefine {
    return new TheThingCellDefine(this);
  }

  extend(options: any): TheThingCellDefine {
    const extendedCellDefine = this.clone();
    extend(extendedCellDefine, options);
    return extendedCellDefine;
  }

  forgeCell(): TheThingCell {
    const cell = this.createCell(OmniTypes[this.type].forge());
    return cell;
  }

  createCell(value?: any): TheThingCell {
    value =
      value === undefined
        ? get(OmniTypes, `${this.type}.default`, null)
        : value;
    return new TheThingCell({
      id: this.id,
      label: this.label,
      type: this.type,
      value: value
    });
  }

  // fromJSON(data: any = {}): this {
  //   extend(this, data);
  //   return this;
  // }

  // toJSON(): any {
  //   return toJSONDeep(this);
  // }
}

export type CommonCellIds =
  | 'album'
  | 'location'
  | 'introduction'
  | 'contact'
  | 'miscNotes';
export const CommonCellDefines: {
  [key in CommonCellIds]: TheThingCellDefine;
} = mapValues(
  {
    album: {
      id: 'album',
      label: '照片',
      type: 'album'
    },
    location: {
      id: 'location',
      label: '地點',
      type: 'location'
    },
    introduction: {
      id: 'introduction',
      label: '簡介',
      type: 'html'
    },
    contact: {
      id: 'contact',
      label: '聯絡資訊',
      type: 'contact'
    },
    miscNotes: {
      id: 'miscNotes',
      label: '其他，備註',
      type: 'html'
    }
  },
  options => new TheThingCellDefine(options)
);
