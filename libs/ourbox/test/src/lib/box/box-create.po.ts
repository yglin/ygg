import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { ImageUploaderPageObjectCypress } from '@ygg/shared/omni-types/test';
import { Image } from '@ygg/shared/omni-types/core';

export class BoxCreatePageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.box-create',
    inputName: 'input.box-name',
    buttonNextStep: 'button.next-step:visible',
    buttonSubmit: 'button.submit',
    inputMemberEmail: 'input.member-email',
    memberEmailList: '.member-list',
    buttonAddEmail: 'button.add-email',
    thumbnailImages: '.thumbnail-images',
    buttonAddImage: 'button.add-images'
  };

  getSelectorForMemberEmail(email: string): string {
    return `${this.getSelector('memberEmailList')} .member[email="${email}"]`;
  }

  inputName(name: string) {
    cy.get(this.getSelector('inputName'))
      .clear()
      .type(name);
  }

  addMemberEmail(email: string) {
    cy.get(this.getSelector('inputMemberEmail'))
      .clear()
      .type(email);
    cy.get(this.getSelector('buttonAddEmail')).click();
    cy.get(this.getSelectorForMemberEmail(email)).should('be.visible');
  }

  selectImage(imageSrc: string) {
    cy.get(this.getSelector('thumbnailImages'))
      .find(`.thumbnail-image img[src="${imageSrc}"]`)
      .click();
  }

  selectCustomImage(imageSrc: string) {
    cy.get(this.getSelector('buttonAddImage')).click();
    const imageUploadPO = new ImageUploaderPageObjectCypress();
    imageUploadPO.expectOpen();
    imageUploadPO.addImagesByUrl([new Image(imageSrc)]);
    imageUploadPO.submit();
    this.selectImage(imageSrc);
  }

  nextStep() {
    cy.get(this.getSelector('buttonNextStep')).click();
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click();
  }
}
