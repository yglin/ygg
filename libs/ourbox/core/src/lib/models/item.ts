import { OmniTypes } from '@ygg/shared/omni-types/core';
import {
  TheThingCellDefine,
  TheThingImitation,
  TheThingState,
  TheThing
} from '@ygg/the-thing/core';
import { values } from 'lodash';

export const ImitationItemCells = {
  album: new TheThingCellDefine({
    name: '照片',
    type: OmniTypes.album.id,
    userInput: 'required'
  }),
  location: new TheThingCellDefine({
    name: '所在地',
    type: OmniTypes.location.id,
    userInput: 'required'
  })
};

export const ImitationItemStates: { [name: string]: TheThingState } = {
  new: {
    name: 'new',
    label: '新建立',
    value: 10
  },
  editing: {
    name: 'editing',
    label: '修改中',
    value: 30
  },
  available: {
    name: 'available',
    label: '開放索取',
    value: 100
  },
  transfer: {
    name: 'transfer',
    label: '正在讓渡',
    value: 110
  }
};

export const ImitationItem = new TheThingImitation({
  collection: 'ourbox-items',
  id: 'ourbox-item',
  name: '我們的寶物',
  routePath: 'ouritems',
  cellsDef: values(ImitationItemCells),
  stateName: 'ourbox-item-state',
  states: ImitationItemStates,
  canModify: (theThing: TheThing): boolean => {
    return (
      ImitationItem.isState(theThing, ImitationItem.states.new) ||
      ImitationItem.isState(theThing, ImitationItem.states.editing)
    );
  },
  creators: [
    (theThing: TheThing): TheThing => {
      ImitationItem.setState(theThing, ImitationItem.states.new);
      return theThing;
    }
  ]
});

export const RelationshipItemHolder = {
  role: 'item holder'
};

export const RelationshipItemRequestBorrow = {
  role: 'request borrow item'
};

// export class Item extends TheThing {
//   static forge() {
//     const item = TheThing.forge();
//     item.addCell(
//       new TheThingCell({
//         name: CellNames.location,
//         type: OmniTypes.location.id,
//         value: Location.forge()
//       })
//     );
//     return item;
//   }
// }
