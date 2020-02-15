import { Image } from '@ygg/shared/omni-types/core';
import { ImageUploaderPageObject } from '@ygg/shared/types';

export class ImageUploaderPageObjectCypress extends ImageUploaderPageObject {
  selector: string;
  divImagePreviewsSelector: string;
  inputImageUrlSelector: string;
  buttonAddImageUrlSelector: string;
  buttonSubmitSelector: string;

  expectOpen() {
    cy.get(this.getSelector('buttonSubmit')).should('be.visible');
  }

  expectClose() {
    cy.get(this.getSelector('buttonSubmit')).should('not.be.visible');
  }

  addImagesByUrl(images: Image[]) {
    cy.wrap(images).each((image: Image) => {
      cy.get(this.getSelector('inputImageUrl'))
        .clear({ force: true })
        .type(image.src);
      cy.get(this.getSelector('buttonAddImageUrl'), { timeout: 10000 }).click();
    });
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit'), { timeout: 10000 }).click();
  }
}
