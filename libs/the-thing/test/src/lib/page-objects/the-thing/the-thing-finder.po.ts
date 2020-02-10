import { TheThing } from '@ygg/the-thing/core';
import { TheThingFinderPageObject } from '@ygg/the-thing/ui';
import { ChipsControlPageObjectCypress } from '@ygg/shared/test/cypress';
import { ImageThumbnailListPageObjectCypress } from '@ygg/shared/ui/test';
import { ImageThumbnailListPageObject } from '@ygg/shared/ui/widgets';

export class TheThingFinderPageObjectCypress extends TheThingFinderPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.imageThumbnailList = new ImageThumbnailListPageObjectCypress(
      this.getSelector('theThingList')
    );
  }

  expectVisible() {
    cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  find(theThing: TheThing) {
    const chipsControlPO = new ChipsControlPageObjectCypress(
      this.getSelector('tagsFilter')
    );
    chipsControlPO.setValue(theThing.tags.toNameArray());
    cy.get(this.getSelector('inputSearchName'))
      .clear({ force: true })
      .type(theThing.name);
    this.imageThumbnailList.expectItem(theThing);
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click({ force: true });
  }
}
