import { PlayViewPageObject } from '@ygg/playwhat/ui';
import { TheThing } from '@ygg/the-thing/core';
import {
  AlbumViewPageObjectCypress,
  LocationViewPageObjectCypress
} from '@ygg/shared/omni-types/test';
import { CellNamePrice } from '@ygg/shopping/core';
import { AdditionViewPageObjectCypress } from '@ygg/shopping/test';
import { ImageThumbnailListPageObjectCypress } from '@ygg/shared/ui/test';
import { ImitationPlay } from '@ygg/playwhat/core';

export class PlayViewPageObjectCypress extends PlayViewPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.albumViewPO = new AlbumViewPageObjectCypress(
      this.getSelector('album')
    );
  }

  expectVisible(): Cypress.Chainable<any> {
    return cy.get(this.getSelector()).should('be.visible');
  }

  expectValue(play: TheThing): void {
    cy.get(this.getSelector('name')).contains(play.name);
    const subtitle = play.getCellValue('副標題');
    if (subtitle) {
      cy.get(this.getSelector('subtitle')).contains(subtitle);
    }
    this.albumViewPO.expectValue(play.getCellValue('照片'));
    cy.get(this.getSelector('price')).contains(play.getCellValue('費用'));
    cy.get(this.getSelector('timeLength')).contains(play.getCellValue('時長'));
    cy.get(this.getSelector('limitOnNumber')).contains(
      `人數限制：${play.getCellValue('人數下限')} - ${play.getCellValue(
        '人數上限'
      )} 人`
    );
    const location = play.getCellValue('地點');
    if (location) {
      const locationViewPO = new LocationViewPageObjectCypress(
        this.getSelector('location')
      );
      locationViewPO.expectValue(location);
    }

    // for (const optionalCellDef of ImitationPlay.getOptionalCellDefs()) {
    //   const cell = play.getCell(optionalCellDef.name);
    //   if (cell && cell.value) {
    //     const cellViewPO = new TheThingCellViewPageObjectCypress(
    //       this.getSelectorForCell(cell)
    //     );
    //     cellViewPO.expectValue(cell);
    //   } else {
    //     cy.get(this.getSelectorForCell(optionalCellDef.name)).should(
    //       'not.exist'
    //     );
    //   }
    // }
  }

  expectAdditions(additions: TheThing[]) {
    const additionListPO = new ImageThumbnailListPageObjectCypress(
      this.getSelector('additionList')
    );
    additionListPO.expectItems(additions);
  }
}
