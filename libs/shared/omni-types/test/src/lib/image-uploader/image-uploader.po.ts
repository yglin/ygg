import { Image } from '@ygg/shared/omni-types/core';
import { ImageUploaderPageObject } from '@ygg/shared/omni-types/ui';

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
    cy.get(this.getSelector('buttonSubmit')).should('not.exist');
  }

  addImageUrl(imageUrl: string) {
    cy.get(this.getSelector('inputImageUrl'))
      .clear({ force: true })
      .invoke('val', imageUrl)
      .trigger('input');
    cy.get(this.getSelector('buttonAddImageUrl'), { timeout: 10000 }).click();
  }

  addImagesByUrl(images: Image[]) {
    cy.wrap(images).each((image: Image) => {
      this.addImageUrl(image.src);
    });
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit'), { timeout: 10000 })
      .scrollIntoView()
      .click();
  }
}
