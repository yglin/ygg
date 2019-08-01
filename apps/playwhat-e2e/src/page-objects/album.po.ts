import { Album } from '@ygg/shared/types';
import { ImageUploaderPageObject } from './image-uploader.po';

export class AlbumControlPageObject {
  selector: string;
  imageUploader: ImageUploaderPageObject;

  constructor(parentSelector: string = '') {
    this.selector = `${parentSelector} .album-control`.trim();
    this.imageUploader = new ImageUploaderPageObject();
  }

  fillIn(album: Album) {
    cy.get(`${this.selector} #add-photos`).click();
    this.imageUploader.expectOpen();
    this.imageUploader.addImagesByUrl(album.photos);
    this.imageUploader.submit();
    this.imageUploader.expectClose();
    // Click to set cover photo
    cy.get(`${this.selector} .photo-list img[src="${album.cover.src}"]`).first().click();
  }
}

export class AlbumViewPageObject {
  selector: string;

  constructor(parentSelector: string = '') {
    this.selector = `${parentSelector} .album-view`.trim();
  }

  checkData(album: Album) {
    cy.get(
      `${this.selector} .cover img[src="${album.cover.src}"]`
    ).should('be.visible');
    for (const photo of album.photos) {
      cy.get(
        `${this.selector} .photo-list .photo img[src="${photo.src}"]`
      ).should('be.visible');
    }
  }
}
