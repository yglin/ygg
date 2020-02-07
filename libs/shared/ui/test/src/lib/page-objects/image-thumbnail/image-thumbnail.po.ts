import {
  ImageThumbnailPageObject,
  ImageThumbnailItem
} from '@ygg/shared/ui/widgets';

export class ImageThumbnailPageObjectCypress extends ImageThumbnailPageObject {
  expectValue(item: ImageThumbnailItem) {
    cy.get(this.getSelector('name')).should('include.text', item.name);
    cy.get(`${this.getSelector('image')} img`)
      .invoke('attr', 'src')
      .should('eq', item.image);
  }
}
