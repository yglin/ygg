import { PageObject } from '@ygg/shared/test/page-object';

export class PlayViewPagePageObjectCypress extends PageObject {
  selectors = {
    main: '.ygg-play-view-page',
    buttonGotoEdit: 'button.go-to-edit'
  }

  gotoEdit() {
    cy.get(this.getSelector('buttonGotoEdit')).click();
  }
}