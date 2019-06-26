import { loginAdmin, logout } from "../support/app.po";

describe('Test admin functionalities', () => {
  beforeEach(function() {
    cy.visit('/');
    loginAdmin();
    // cy.wait(10000);
  });

  afterEach(function() {
    logout();
  });
  
  it('should show admin link in user menu, and it should work', () => {
    cy.get('#account-widget .menu-trigger').click();
    cy.get('#user-menu button#admin').click();
    cy.url().should('include', 'admin');
  });
});
