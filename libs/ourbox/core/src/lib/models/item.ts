import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import { CellNames } from './cell-names';
import { OmniTypes, Location } from '@ygg/shared/omni-types/core';

export class Item extends TheThing {
  static forge() {
    const item = TheThing.forge();
    item.addCell(
      new TheThingCell({
        name: CellNames.location,
        type: OmniTypes.location.id,
        value: Location.forge()
      })
    );
    return item;
  }
}
