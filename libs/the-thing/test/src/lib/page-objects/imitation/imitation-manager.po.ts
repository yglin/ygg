import { ImitationManagerPageObject } from '@ygg/the-thing/ui';
import { TheThingImitation, TheThing } from '@ygg/the-thing/core';
import { ImitationEditorPageObjectCypress } from './imitation-editor.po';
import { ImageThumbnailListPageObjectCypress } from "@ygg/shared/ui/test";

export class ImitationManagerPageObjectCypress extends ImitationManagerPageObject {
  imitationListPO: ImageThumbnailListPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.imitationListPO = new ImageThumbnailListPageObjectCypress(
      this.getSelector()
    );
  }

  expectVisible() {
    cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  addImitation(imitation: TheThingImitation, template: TheThing) {
    cy.get(this.getSelector('buttonAddImitation')).click();
    const theThingImitationEditorPO = new ImitationEditorPageObjectCypress();
    theThingImitationEditorPO.expectVisible();
    theThingImitationEditorPO.setValue(imitation, template);
    theThingImitationEditorPO.submit();
    theThingImitationEditorPO.expectVisible(false);
    this.imitationListPO.expectLastItem(imitation);
  }
}
