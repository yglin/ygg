import {
  ImageThumbnailSelectorPageObject,
  ImageThumbnailItem
} from '@ygg/shared/ui/widgets';

export class ImageThumbnailSelectorPageObjectCypress extends ImageThumbnailSelectorPageObject {
  expectVisible(flag: boolean = true) {
    if (flag) {
      cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
    } else {
      cy.get(this.getSelector(), { timeout: 10000 }).should('not.be.visible');
    }
  }

  expectItem(item: ImageThumbnailItem) {
    cy.get(`${this.getSelector()} .item img[src="${item.image}"]`).should('exist');
    cy.get(`${this.getSelector()} .item`).contains(item.name).should('exist');
  }

  expectItems(items: ImageThumbnailItem[]) {
    cy.wrap(items).each((item: any) => this.expectItem(item));
  }

  selectItem(item: ImageThumbnailItem) {
    cy.get(this.getSelectorForItem(item)).click({ force: true });
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click({ force: true });
  }
}
