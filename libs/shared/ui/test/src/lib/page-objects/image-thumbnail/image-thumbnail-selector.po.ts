import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { ImageThumbnailItem } from '@ygg/shared/ui/widgets';

export class ImageThumbnailSelectorPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.image-thumbnail-selector',
    buttonSubmit: 'button.submit',
    buttonCreate: 'button.create'
  };

  // getSelectorByItemName(name: string): string {
  //   return `${this.getSelector()} .item:contains("${name}")`;
  // }

  getSelectorForItem(item: ImageThumbnailItem): string {
    return `${this.getSelector()} .item:contains("${item.name}")`;
  }

  expectItem(item: ImageThumbnailItem) {
    cy.get(`${this.getSelector()} .item img[src="${item.image}"]`).should(
      'exist'
    );
    cy.get(`${this.getSelector()} .item`)
      .contains(item.name)
      .should('exist');
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

  gotoCreateNew() {
    cy.get(this.getSelector('buttonCreate')).click();
  }
}
