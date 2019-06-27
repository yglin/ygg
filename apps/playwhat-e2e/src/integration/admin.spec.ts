import { loginAdmin, logout } from '../support/app.po';

describe('Test admin functionalities', () => {
  beforeEach(function() {
    cy.visit('/');
    loginAdmin();
  });

  afterEach(function() {
    logout();
  });

  it('should show admin link in user menu, and it should link to admin dashboard page', () => {
    cy.get('#account-widget .menu-trigger').click();
    cy.get('#user-menu button#admin').click();
    cy.url().should('include', 'admin');
    cy.get('#admin-dashboard').should('be.visible');
  });

  describe('In admin dashboard page', () => {
    beforeEach(function() {
      cy.visit('/admin');
    });
    
    it('should show link to users administration, and it should link to users administration page', () => {
      cy.get('#admin-dashboard a#admin-users').click();
      cy.url().should('include', 'admin/users');
      cy.get('#admin-users').should('be.visible');
    });
  });
});

describe('Admin securities', () => {
  it('Only admin user can access admin route', () => {
    // User not logged in
    logout();
    cy.visit('/admin');
    // Redirect user back to home
    cy.url().should('match', /.*\/home$/);
  });
});


