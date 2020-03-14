import { MyThingsPageObject } from '@ygg/the-thing/ui';
import { TheThingFinderPageObjectCypress } from './the-thing-finder.po';
import { TheThingImitation, TheThing } from '@ygg/the-thing/core';
import { ImageThumbnailListPageObjectCypress } from '@ygg/shared/ui/test';

export class MyThingsPageObjectCypress extends MyThingsPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.theThingListPO = new ImageThumbnailListPageObjectCypress(
      this.getSelector()
    );
  }

  expectVisible(): Cypress.Chainable<any> {
    return cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  applyImitation(selection: TheThing[], imitation: TheThingImitation) {
    this.theThingListPO.selectItems(selection);
    cy.get(this.getSelector('buttonApplyImitation')).click();
    const imitationSelectorDialogPO = new ImageThumbnailListPageObjectCypress(
      '.ygg-dialog'
    );
    imitationSelectorDialogPO.expectVisible();
    imitationSelectorDialogPO.selectItem(imitation);
    // cy.on('window:alert', str => {
    //   expect(str).to.equal(
    //     `${selection.map(select => select.name).join('，')}\n套用範本 ${
    //       imitation.name
    //     } 完成。`
    //   );
    // });
    imitationSelectorDialogPO.submit();
    imitationSelectorDialogPO.expectVisible(false);
    cy.wait(5000);
  }

  deleteThings(things: TheThing[]): void {
    this.theThingListPO.selectItems(things);
    cy.get(this.getSelector('buttonDeleteSelection'), {
      timeout: 10000
    }).click();
    this.theThingListPO.expectNoItems(things);
  }

  deleteAll() {
    this.theThingListPO.selectAll();
    cy.get(this.getSelector('buttonDeleteSelection'), {
      timeout: 10000
    }).click();
    this.theThingListPO.expectEmpty();
  }
}
