import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import { AlbumViewPageObject } from '@ygg/shared/omni-types/ui';
import { TheThingPageObject } from '@ygg/the-thing/ui';

export abstract class PlayViewPageObject extends TheThingPageObject {}

// export abstract class PlayViewPageObject extends PageObject {
//   selectors = {
//     main: '.play-view',
//     name: '.name',
//     additionList: '.addition-list',
//     buttonAddToCart: 'button.add-to-cart',
//     buttonAddCell: 'button.add-cell',
//     buttonSave: 'button.save',
//     equipments: '.equipments',
//     buttonCreateEquipment: 'button.create-equipment'
//   };
//   albumViewPO: AlbumViewPageObject;

//   getSelectorForCell(cell: TheThingCell | string): string {
//     let cellName: string;
//     if (typeof cell === 'string') {
//       cellName = cell;
//     } else {
//       cellName = cell.name;
//     }
//     return `${this.getSelector()} .cells [cell-name="${cellName}"]`;
//   }

//   getSelectorForCellDeleteButton(cellName: string): any {
//     return `${this.getSelectorForCell(cellName)} button.delete`;
//   }

//   getSelectorForEquipment(equip: TheThing): string {
//     return `${this.getSelector('equipments')} .equipment:contains("${
//       equip.name
//     }")`;
//   }

//   abstract expectVisible(): void;
//   abstract expectValue(play: TheThing): void;
// }
