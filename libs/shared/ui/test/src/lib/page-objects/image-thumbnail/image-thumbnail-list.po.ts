import {
  ImageThumbnailListPageObject,
  ImageThumbnailItem
} from '@ygg/shared/ui/widgets';
import { ImageThumbnailItemPageObjectCypress } from './image-thumbnail-item.po';

export class ImageThumbnailListPageObjectCypress extends ImageThumbnailListPageObject {
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

  expectItem(item: ImageThumbnailItem) {
    cy.get(this.getSelector())
      .contains('.item', item.name)
      .scrollIntoView()
      .should('be.visible');
  }

  expectItemByNameAndImage(item: ImageThumbnailItem) {
    cy.get(`${this.getSelector()} [item-name="${item.name}"]`).should(
      'be.exist'
    );
    cy.get(`${this.getSelector()} [item-image="${item.image}"]`).should(
      'be.exist'
    );
  }

  expectNoItem(item: ImageThumbnailItem) {
    cy.get(this.getSelectorForItem(item)).should('not.be.exist');
  }

  expectItems(items: ImageThumbnailItem[]) {
    cy.wrap(items).each((item: any) => this.expectItem(item));
    cy.get(this.getSelector())
      .find('[item-id]')
      .its('length')
      .should('eq', items.length);
  }

  expectVisible(flag: boolean = true) {
    if (flag) {
      cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
    } else {
      cy.get(this.getSelector(), { timeout: 10000 }).should('not.be.visible');
    }
  }

  deleteItem(item: ImageThumbnailItem) {
    cy.get(this.getSelectorForDeleteItem(item)).click({ force: true });
  }

  selectItem(item: ImageThumbnailItem) {
    cy.get(this.getSelectorForItem(item), { timeout: 10000 }).click({
      force: true
    });
    this.expectSelectedItem(item);
  }

  selectItems(items: ImageThumbnailItem[]) {
    cy.wrap(items).each((item: any) => this.selectItem(item));
  }

  expectSelectedItem(item: ImageThumbnailItem) {
    cy.get(this.getSelector('selection'))
      .find(`[item-id="${item.id}"]`)
      .should('exist');
  }

  clearSelection() {
    cy.get(this.getSelector('buttonClearSelection')).click({ force: true });
  }

  clickItem(item: ImageThumbnailItem) {
    cy.get(this.getSelectorForItem(item)).click({ force: true });
  }

  clickItemLink(item: ImageThumbnailItem) {
    cy.get(this.getSelectorForItemLink(item)).click({ force: true });
  }

  selectLastItem(item: ImageThumbnailItem) {
    cy.get(this.getSelector('lastItem')).click({ force: true });
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click();
  }
}
