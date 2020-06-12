import { OmniTypes } from '@ygg/shared/omni-types/core';
import { TheThingCellDefine, TheThingImitation } from '@ygg/the-thing/core';
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

export const ImitationItem = new TheThingImitation().fromJSON({
  collection: 'ourbox-items',
  id: 'ourbox-item',
  name: '我們的寶物',
  routePath: 'ouritem',
  cellsDef: values(ImitationItemCells)
});

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
