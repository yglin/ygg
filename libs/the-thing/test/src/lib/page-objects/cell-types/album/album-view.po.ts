import { Album, Image } from '@ygg/shared/omni-types/core';
import { AlbumViewPageObject } from '@ygg/shared/omni-types/ui';

export class AlbumViewPageObjectCypress extends AlbumViewPageObject {
  expectValue(album: Album) {
    cy.get(this.getSelector('coverImg'))
      .invoke('attr', 'src')
      .should('eq', album.cover.src);
    cy.wrap(album.photos).each((photo: Image, index: number) => {
      cy.get(this.getSelectorForPhotoAt(index))
        .invoke('attr', 'src')
        .should('eq', photo.src);
    });
  }
}
