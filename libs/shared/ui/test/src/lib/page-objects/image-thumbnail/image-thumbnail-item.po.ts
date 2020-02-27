import {
  ImageThumbnailItemPageObject,
  ImageThumbnailItem
} from '@ygg/shared/ui/widgets';

export class ImageThumbnailItemPageObjectCypress extends ImageThumbnailItemPageObject {
  expectVisible(): void {
    cy.get(this.getSelector()).should('be.visible');
  }

  expectValue(item: ImageThumbnailItem) {
    cy.get(this.getSelector('name')).should('include.text', item.name);
    cy.get(`${this.getSelector('image')} img`)
      .invoke('attr', 'src')
      .should('eq', item.image);
  }
}
