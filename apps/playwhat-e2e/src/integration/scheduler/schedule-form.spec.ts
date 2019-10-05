import { login, hitUserMenu } from "../../page-objects/app.po";

describe('Scheduler', () => {
  beforeEach(function() {
    cy.visit('/scheduler');
  });
  
  it('New schedule shows schedule form', () => {
    cy.get('form#schedule-form').should('be.visible');
  });

  it('should follow user menu link to my schedule forms page', () => {
    login();
    hitUserMenu('scheduler');
    cy.url().should(url => {
      expect(url).to.match(/.*\/scheduler\/my$/);
    });
    cy.get('#scheduler-dashboard a#schedule-form-list').click();
    cy.url().should(url => {
      expect(url).to.match(/.*\/scheduler\/my\/forms$/);
    });
    cy.get('#schedule-forms-list').should('be.visible');
  });
});
