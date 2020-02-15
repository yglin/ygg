import {
  ImageThumbnailListPageObject,
  ImageThumbnailItem
} from '@ygg/shared/ui/widgets';
import { ImageThumbnailPageObjectCypress } from './image-thumbnail.po';

export class ImageThumbnailListPageObjectCypress extends ImageThumbnailListPageObject {
  expectFirstItem(item: ImageThumbnailItem) {
    const imageThumbnailPO = new ImageThumbnailPageObjectCypress(
      this.getSelector('firstItem')
    );
    imageThumbnailPO.expectValue(item);
  }

  expectLastItem(item: ImageThumbnailItem) {
    const imageThumbnailPO = new ImageThumbnailPageObjectCypress(
      this.getSelector('lastItem')
    );
    imageThumbnailPO.expectValue(item);
  }

  expectItem(item: ImageThumbnailItem) {
    cy.get(this.getSelectorForItem(item)).should('be.exist');
  }

  expectItemByNameAndImage(item: ImageThumbnailItem) {
    cy.get(`${this.getSelector()} [item-id]`)
      .contains(item.name)
      .should('be.exist');
    cy.get(`${this.getSelector()} [item-id]`)
      .find(`img[src="${item.image}"]`)
      .should('be.exist');
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
    cy.get(this.getSelectorForItem(item)).click({ force: true });
    this.expectSelectedItem(item);
  }

  expectSelectedItem(item: ImageThumbnailItem) {
    cy.get(this.getSelector('selection')).find(`[item-id="${item.id}"]`).should('exist');
  }

  clearSelection() {
    cy.get(this.getSelector('buttonClearSelection')).click({ force: true });
  }

  clickItem(item: ImageThumbnailItem) {
    cy.get(this.getSelectorForItem(item)).click({ force: true });
  }

  selectLastItem(item: ImageThumbnailItem) {
    cy.get(this.getSelector('lastItem')).click({ force: true });
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click();
  }
}
