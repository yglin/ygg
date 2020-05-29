import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import { AlbumViewPageObject } from '@ygg/shared/omni-types/ui';

export abstract class PlayViewPageObject extends PageObject {
  selectors = {
    main: '.play-view',
    name: '.name',
    additionList: '.addition-list',
    buttonAddToCart: 'button.add-to-cart',
    buttonAddCell: 'button.add-cell',
    buttonSave: 'button.save'
  };
  albumViewPO: AlbumViewPageObject;

  getSelectorForCell(cell: TheThingCell | string): string {
    let cellName: string;
    if (typeof cell === 'string') {
      cellName = cell;
    } else {
      cellName = cell.name;
    }
    return `${this.getSelector()} [cell-name="${cellName}"]`;
  }

  abstract expectVisible(): void;
  abstract expectValue(play: TheThing): void;
}
