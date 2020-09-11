import { PageObjectCypress } from '@ygg/shared/test/cypress';
import {
  HtmlControlPageObjectCypress,
  HtmlViewPageObjectCypress
} from '@ygg/shared/omni-types/test';
import { Html } from '@ygg/shared/omni-types/core';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';

export class CustomPagePageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.custom-page',
    buttonOpenEditor: 'button.open-editor',
    htmlEditor: '.html-editor',
    htmlView: '.html-view',
    tabHeaderPreview: '.tab-header.preview',
    buttonSave: 'button.save',
    buttonCancel: 'button.cancel'
  };

  htmlEditorPO: HtmlControlPageObjectCypress;
  htmlViewPO: HtmlViewPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.htmlEditorPO = new HtmlControlPageObjectCypress(
      this.getSelector('htmlEditor')
    );
    this.htmlViewPO = new HtmlViewPageObjectCypress(
      this.getSelector('htmlView')
    );
  }

  expectEditable() {
    cy.get(`.edit`).should('be.visible');
  }

  expectReadonly() {
    cy.get(`${this.getSelector()} .edit`).should('not.be.visible');
    cy.get(`${this.getSelector()} .html-view`).should('be.visible');
    this.expectTabsHeaderHidden();
  }

  openEditor() {
    cy.get(this.getSelector('buttonOpenEditor')).click();
  }

  switchToPreview() {
    cy.get(this.getSelector('tabHeaderPreview')).click();
  }

  expectPreview(contentHtml: Html) {
    this.htmlViewPO.expectValue(contentHtml);
  }

  expectTabsHeaderHidden() {
    cy.get(`${this.getSelector()} .tab-header`).should('not.be.visible');
  }

  save() {
    cy.get(this.getSelector('buttonSave')).click();
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(`確定要儲存修改的內容？`);
    emceePO.alert(`已儲存修改內容`);
  }

  cancel() {
    cy.get(this.getSelector('buttonCancel')).click();
  }
}
