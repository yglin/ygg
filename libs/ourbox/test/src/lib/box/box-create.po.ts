import {
  PageObjectCypress,
  MatCheckboxPageObjectCypress
} from '@ygg/shared/test/cypress';
import { ImageUploaderPageObjectCypress } from '@ygg/shared/omni-types/test';
import { Image } from '@ygg/shared/omni-types/core';
import { UsersByEmailSelectorPageObjectCypress } from '@ygg/shared/user/test';

export class BoxCreatePageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.box-create',
    inputName: 'input.box-name',
    buttonNextStep: 'button.next-step:visible',
    buttonSubmit: 'button.submit',
    // inputMemberEmail: 'input.member-email',
    selectMembers: '.members-select',
    // buttonAddEmail: 'button.add-email',
    thumbnailImages: '.thumbnail-images',
    buttonAddImage: 'button.add-images',
    checkboxPublic: '.check-public'
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
    const usersByEmailSelectorPO = new UsersByEmailSelectorPageObjectCypress(
      this.getSelector('selectMembers')
    );
    usersByEmailSelectorPO.addEmail(email);
    // cy.get(this.getSelector('inputMemberEmail'))
    //   .clear()
    //   .type(email);
    // cy.get(this.getSelector('buttonAddEmail')).click();
    // cy.get(this.getSelectorForMemberEmail(email)).should('be.visible');
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

  checkPublic() {
    const matCheckboxPO = new MatCheckboxPageObjectCypress(
      this.getSelector('checkboxPublic')
    );
    matCheckboxPO.check();
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click();
  }
}
