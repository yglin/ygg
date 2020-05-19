import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import { AlbumViewPageObject } from '@ygg/shared/omni-types/ui';

export abstract class PlayViewPageObject extends PageObject {
  selectors = {
    main: '.play-view',
    name: '.name',
    subtitle: '.subtitle',
    album: '.album',
    price: '.price',
    timeLength: '.time-length',
    limitOnNumber: '.limit-on-number',
    location: '.location',
    businessHours: '.business-hours',
    additionList: '.addition-list',
    buttonAddToCart: 'button.add-to-cart'
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
