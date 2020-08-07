import { CellNames as CellNamesShopping } from '@ygg/shopping/core';
import { TheThingCellDefine, TheThingImitation } from '@ygg/the-thing/core';
import { OmniTypes } from '@ygg/shared/omni-types/core';
import { values } from 'lodash';

export const ImitationEquipmentCellDefines = {
  price: new TheThingCellDefine({
    name: CellNamesShopping.price,
    type: OmniTypes.number.id,
    userInput: 'required'
  }),
  maximum: new TheThingCellDefine({
    name: CellNamesShopping.maximum,
    type: OmniTypes.number.id,
    userInput: 'required'
  }),
  minimum: new TheThingCellDefine({
    name: CellNamesShopping.minimum,
    type: OmniTypes.number.id,
    userInput: 'required'
  }),
  album: new TheThingCellDefine({
    name: '照片',
    type: OmniTypes.album.id,
    userInput: 'optional'
  })
};

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
        ImitationEquipmentCellDefines.price.name,
        ImitationEquipmentCellDefines.maximum.name
      ]
    }
  }
});
