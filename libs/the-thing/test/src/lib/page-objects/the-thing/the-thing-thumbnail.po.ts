import { TheThingThumbnailPageObject } from '@ygg/the-thing/ui';
import { TheThing, DisplayThumbnail, TheThingCell } from '@ygg/the-thing/core';
import { ImageThumbnailItemPageObjectCypress } from '@ygg/shared/ui/test';
import { get } from 'lodash';
import { TheThingCellListPageObjectCypress } from '../cell';
import { OmniTypeViewControlPageObjectCypress } from '@ygg/shared/omni-types/test';
import { TimeRange } from '@ygg/shared/omni-types/core';

export class TheThingThumbnailPageObjectCypress extends TheThingThumbnailPageObject {
  expectValue(theThing: TheThing): void {
    const imageThumbnailItemPO = new ImageThumbnailItemPageObjectCypress(
      this.getSelector()
    );
    imageThumbnailItemPO.expectValue(theThing);

    const display: DisplayThumbnail = get(
      this.imitation,
      'displays.thumbnail',
      null
    );
    if (display) {
      cy.wrap(display.cells).each((cellName: string) => {
        const cell: TheThingCell = theThing.getCell(cellName);
        cy.get(this.getSelectorForCell(cellName)).contains(cellName);
        this.expectCell(cell);
      });
    }
  }

  expectCell(cell: TheThingCell) {
    const cellValuePO = new OmniTypeViewControlPageObjectCypress(
      this.getSelectorForCell(cell.name)
    );
    cellValuePO.expectValue(cell.type, cell.value);
  }

  gotoView() {
    const imageThumbnailItemPO = new ImageThumbnailItemPageObjectCypress(
      this.getSelector()
    );
    imageThumbnailItemPO.clickLink();
  }
}
