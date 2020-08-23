import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { User } from '@ygg/shared/user/core';

export class BoxCreatePageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.box-create',
    inputName: 'input.box-name',
    buttonNextStep: 'button.next-step:visible',
    buttonSubmit: 'button.submit',
    inputMemberEmail: 'input.member-email',
    memberEmailList: '.member-list',
    buttonAddEmail: 'button.add-email'
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

  nextStep() {
    cy.get(this.getSelector('buttonNextStep')).click();
  }

  submit() {
    cy.get(this.getSelector('buttonSubmit')).click();
  }
}
