import { ShoppingCellDefines, ShoppingCellIds } from '@ygg/shopping/core';
import { TheThingCellDefine, TheThingImitation } from '@ygg/the-thing/core';
import { OmniTypes } from '@ygg/shared/omni-types/core';
import { values, keyBy } from 'lodash';
import { CellDefines } from './cell-defines';

type CellIds = ShoppingCellIds | 'album';

export const ImitationEquipmentCellDefines: {
  [key in CellIds]?: TheThingCellDefine;
} = keyBy(
  [
    ShoppingCellDefines.price.extend({
      label: '租用單價',
      userInput: 'required'
    }),
    ShoppingCellDefines.maximum.extend({
      label: '租用數量上限',
      userInput: 'required'
    }),
    ShoppingCellDefines.minimum.extend({
      label: '租用數量下限',
      userInput: 'required'
    }),
    CellDefines.album.extend({
      userInput: 'optional'
    })
  ],
  'id'
);

export const ImitationEquipment: TheThingImitation = new TheThingImitation({
  id: 'equipment',
  name: '設備',
  description: '體驗租借用的設備或器具',
  icon: 'headset_mic',
  image: '/assets/images/equipment/equipment.png',
  view: 'equipment',
  tags: ['equipment', '設備'],
  cellsDef: values(ImitationEquipmentCellDefines),
  displays: {
    thumbnail: {
      cells: [
        ImitationEquipmentCellDefines.price.id,
        ImitationEquipmentCellDefines.maximum.id
      ]
    }
  }
});
