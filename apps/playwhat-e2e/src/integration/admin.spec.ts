import { loginAdmin, logout } from '../support/app.po';

describe('Test admin link', () => {
  beforeEach(function() {
    cy.visit('/');
    loginAdmin();
    // Wait for login, this is not a promising solution here but, what the heck.
    cy.wait(3000);
  });

  afterEach(function() {
    logout();
  });

  it('should show admin link in user menu, and it should link to admin dashboard page', () => {
    cy.get('#account-widget .menu-trigger').click();
    cy.get('#user-menu button#admin').click();
    cy.url().should('match', /.*\/admin$/);
    cy.get('#admin-dashboard').should('be.visible');
  });
});

// describe('Admin securities', () => {
//   it('Only admin user can access admin route', () => {
//     // User not logged in
//     logout();
//     cy.visit('/admin');
//     // Redirect user back to home
//     cy.url().should('match', /.*\/home$/);
//   });
// });


