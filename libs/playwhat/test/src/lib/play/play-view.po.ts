import { PlayViewPageObject } from '@ygg/playwhat/ui';
import { TheThing } from '@ygg/the-thing/core';
import { AlbumViewPageObjectCypress } from '@ygg/shared/omni-types/test';
import { CellNamePrice } from '@ygg/shopping/core';
import { AdditionViewPageObjectCypress } from '@ygg/shopping/test';
import { ImageThumbnailListPageObjectCypress } from '@ygg/shared/ui/test';

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
    cy.get(this.getSelector('subtitle')).contains(play.getCellValue('副標題'));
    this.albumViewPO.expectValue(play.getCellValue('照片'));
    cy.get(this.getSelector('price')).contains(play.getCellValue('費用'));
    cy.get(this.getSelector('timeLength')).contains(play.getCellValue('時長'));
    cy.get(this.getSelector('limitOnNumber')).contains(
      `人數限制：${play.getCellValue('人數下限')} - ${play.getCellValue(
        '人數上限'
      )} 人`
    );
  }

  expectAdditions(additions: TheThing[]) {
    const additionListPO = new ImageThumbnailListPageObjectCypress(this.getSelector('additionList'));
    additionListPO.expectItems(additions);
  }
}
