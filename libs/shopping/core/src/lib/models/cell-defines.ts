import { OmniTypes } from '@ygg/shared/omni-types/core';
import { TheThingCellDefine } from '@ygg/the-thing/core';
import { mapValues } from 'lodash';

export type ShoppingCellIds = 'price' | 'quantity' | 'maximum' | 'minimum';

export const ShoppingCellDefines: {
  [key in ShoppingCellIds]: TheThingCellDefine;
} = mapValues(
  {
    price: {
      id: 'price',
      label: '單價',
      type: OmniTypes.number.id
    },
    quantity: {
      id: 'quantity',
      label: '訂購數量',
      type: OmniTypes.number.id
    },
    maximum: {
      id: 'maximum',
      label: '訂購數量上限',
      type: OmniTypes.number.id
    },
    minimum: {
      id: 'minimum',
      label: '訂購數量下限',
      type: OmniTypes.number.id
    }
  },
  value => new TheThingCellDefine(value)
);
