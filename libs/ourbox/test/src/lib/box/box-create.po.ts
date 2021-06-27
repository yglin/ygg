import {
  PageObjectCypress,
  MatCheckboxPageObjectCypress
} from '@ygg/shared/test/cypress';
import {
  ContactControlPageObjectCypress,
  ImageUploaderPageObjectCypress
} from '@ygg/shared/omni-types/test';
import { Contact, Image } from '@ygg/shared/omni-types/core';
import { UsersByEmailSelectorPageObjectCypress } from '@ygg/shared/user/test';
import { ExtraInfoButtonPageObjectCypress } from '@ygg/shared/ui/test';
import { Box } from '@ygg/ourbox/core';
import { Location } from '@ygg/shared/geography/core';
import {
  LocationControlCompactPageObjectCypress,
  LocationControlPageObjectCypress
} from '@ygg/shared/geography/test';

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
    checkboxPublic: '.check-public',
    publicityDescription: '.publicity-description',
    stepHint: 'h2.step-hint:visible',
    stepImage: '.step-image:visible img',
    location: '.location',
    contact: '.contact'
  };

  locationControlPO: LocationControlCompactPageObjectCypress;
  contactControlPO: ContactControlPageObjectCypress;

  constructor(parentSelector: string = '') {
    super(parentSelector);
    this.locationControlPO = new LocationControlCompactPageObjectCypress(
      this.getSelector('location')
    );
    this.contactControlPO = new ContactControlPageObjectCypress(
      this.getSelector('contact')
    );
  }

  setValue(box: Box) {
    this.setName(box.name);
    this.nextStep();
    this.selectImage(box.image);
    this.nextStep();
    this.setLocation(box.location);
    this.nextStep();
    this.setContact(box.contact);
    this.nextStep();
    this.setPublic(box.public);
  }

  setLocation(location: Location) {
    this.locationControlPO.setValue(location);
  }

  expectStepHint(hint: string) {
    cy.get(this.getSelector('stepHint')).should('include.text', hint);
  }

  getSelectorForMemberEmail(email: string): string {
    return `${this.getSelector('memberEmailList')} .member[email="${email}"]`;
  }

  showPublicDescription(description: string) {
    const extraInfoButtonPO = new ExtraInfoButtonPageObjectCypress(
      this.getSelector('publicityDescription')
    );
    extraInfoButtonPO.showInfo();
    extraInfoButtonPO.expectInfo(description);
  }

  setName(name: string) {
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
      .click()
      .parent()
      .should('have.class', 'selected');
    cy.get(this.getSelector('stepImage')).should('have.attr', 'src', imageSrc);
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

  setContact(contact: Contact) {
    this.contactControlPO.setValue(contact);
  }

  setPublic(isPublic: boolean) {
    if (isPublic) {
      const matCheckboxPO = new MatCheckboxPageObjectCypress(
        this.getSelector('checkboxPublic')
      );
      matCheckboxPO.check();
    }
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click();
  }
}
