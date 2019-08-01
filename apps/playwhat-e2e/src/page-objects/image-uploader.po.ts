import { Image } from '@ygg/shared/types';

export class ImageUploaderPageObject {
  selector: string;
  divImagePreviewsSelector: string;
  inputImageUrlSelector: string;
  buttonAddImageUrlSelector: string;
  buttonSubmitSelector: string;

  constructor() {
  // This is dialog, usually no parent selector
  this.selector = 'div.image-uploader';
  // this.divImagePreviewsSelector = `${this.selector} div.previews`;
  this.inputImageUrlSelector = `${this.selector} .url-input input`;
  this.buttonAddImageUrlSelector = `${this.selector} .url-input button`;
  this.buttonSubmitSelector = `${this.selector} button#submit`;
}

  expectOpen() {
    cy.get(this.selector).should('be.visible');
  }

  expectClose() {
    cy.get(this.selector).should('not.be.visible');
  }
  
  addImagesByUrl(images: Image[]) {
    for (const image of images) {
      cy.get(this.inputImageUrlSelector).type(image.src);
      cy.get(this.buttonAddImageUrlSelector).click();
      // cy.get(`${this.divImagePreviewsSelector} img[src="${image.src}"]`).should(
      //   'be.visible'
      // );
    }
  }

  submit() {
    cy.get(this.buttonSubmitSelector).click();
  }
}
