import { Album } from '@ygg/shared/omni-types/core';
import { AlbumControlPageObject } from '@ygg/shared/omni-types/ui';
import { ImageUploaderPageObjectCypress } from '../image-uploader';

export class AlbumControlPageObjectCypress extends AlbumControlPageObject {
  selector: string;

  expectValue(album: Album) {
    cy.get(this.getSelectorForCover(album.cover.src)).should('exist');
    cy.wrap(album.photos).each((photo: any) => {
      cy.get(this.getSelectorForPhoto(photo.src)).should('exist');
    });
  }

  setValue(album: Album) {
    cy.get(this.getSelector('buttonClearAll')).click();
    cy.get(this.getSelector('addPhotos')).click();
    const imageUploader = new ImageUploaderPageObjectCypress();
    imageUploader.expectOpen();
    imageUploader.addImagesByUrl(album.photos);
    imageUploader.submit();
    // imageUploader.expectClose();
    // Click to set cover photo
    cy.get(this.getSelectorForPhoto(album.cover.src))
      .first()
      .click();
  }

  expectHint(hintMessage: string) {
    cy.get('.mat-tooltip').contains(hintMessage);
  }
}
