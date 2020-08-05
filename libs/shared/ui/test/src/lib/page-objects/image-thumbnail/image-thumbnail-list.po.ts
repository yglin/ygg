import {
  ImageThumbnailListPageObject,
  ImageThumbnailItem,
  ImageThumbnailItemPageObject
} from '@ygg/shared/ui/widgets';
import { ImageThumbnailItemPageObjectCypress } from './image-thumbnail-item.po';
import { defaults } from 'lodash';

export class ImageThumbnailListPageObjectCypress extends ImageThumbnailListPageObject {
  getItemPageObject(
    item: ImageThumbnailItem
  ): ImageThumbnailItemPageObjectCypress {
    return new ImageThumbnailItemPageObjectCypress(
      this.getSelectorForItem(item)
    );
  }

  getItem(item: ImageThumbnailItem): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.getSelectorForItem(item), { timeout: 10000 }).first();
    // .contains('.item', item.name)
    // .find(`img[src="${item.image}"]`)
    // .parentsUntil('.item-list', '.item');
  }

  expectFirstItem(item: ImageThumbnailItem) {
    const imageThumbnailPO = new ImageThumbnailItemPageObjectCypress(
      this.getSelector('firstItem')
    );
    imageThumbnailPO.expectValue(item);
  }

  expectLastItem(item: ImageThumbnailItem) {
    const imageThumbnailPO = new ImageThumbnailItemPageObjectCypress(
      this.getSelector('lastItem')
    );
    imageThumbnailPO.expectValue(item);
  }

  expectSomeItem() {
    cy.get(this.getSelectorForItem(), { timeout: 10000 }).should('exist');
  }

  expectItem(item: ImageThumbnailItem) {
    this.getItem(item)
      .scrollIntoView()
      .should('be.visible');
  }

  expectItems(items: ImageThumbnailItem[], options?: { exact: boolean }) {
    options = defaults(options, {
      exact: true
    });
    cy.wrap(items).each((item: any) => this.expectItem(item));
    if (options.exact) {
      cy.get(this.getSelector())
        .find('.item')
        .its('length')
        .should('eq', items.length);
    }
  }

  expectNoItem(item: ImageThumbnailItem) {
    cy.get(this.getSelectorForItem(item)).should('not.exist');
  }

  expectNoItems(items: ImageThumbnailItem[]) {
    cy.wrap(items).each((item: any) => this.expectNoItem(item));
  }

  expectEmpty() {
    cy.get(`${this.getSelector()} .item`, { timeout: 10000 }).should(
      'not.exist'
    );
  }

  expectVisible(flag: boolean = true) {
    if (flag) {
      cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
    } else {
      cy.get(this.getSelector(), { timeout: 10000 }).should('not.be.visible');
    }
  }

  selectAll() {
    cy.get(this.getSelector('buttonSelectAll')).click();
  }

  selectItem(item: ImageThumbnailItem) {
    this.clickItem(item);
    this.expectSelectedItem(item);
  }

  selectItems(items: ImageThumbnailItem[]) {
    cy.wrap(items).each((item: any) => this.selectItem(item));
    cy.get(this.getSelector('selectionHint')).contains(
      `選了 ${items.length} 個物件`
    );
  }

  expectSelectedItem(item: ImageThumbnailItem) {
    this.getItem(item).should('have.class', 'selected');
  }

  clearSelection() {
    cy.get(this.getSelector('buttonClearSelection')).click();
  }

  clickItem(item: ImageThumbnailItem) {
    this.getItem(item).click({ force: true });
  }

  clickItemLink(item: ImageThumbnailItem) {
    this.getItem(item)
      .find('.open-link')
      .click();
  }

  selectLastItem(item: ImageThumbnailItem) {
    cy.get(this.getSelector('lastItem')).click();
  }

  // deleteItem(item: ImageThumbnailItem) {
  //   cy.get(`${this.getSelectorForDeleteItem(item)}`).click();
  //   this.expectNoItem(item);
  // }

  // deleteItems(items: ImageThumbnailItem[]) {
  //   this.selectItems(items);
  //   cy.get(this.getSelector('buttonDeleteSelection')).click();
  //   cy.wait(10000);
  //   this.expectNoItems(items);
  // }

  // deleteAll() {
  //   this.selectAll();
  //   cy.get(this.getSelector('buttonDeleteSelection')).click();
  //   cy.wait(10000);
  //   this.expectEmpty();
  // }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click();
  }
}
