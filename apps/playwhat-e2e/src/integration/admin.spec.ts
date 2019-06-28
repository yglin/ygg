import { loginAdmin, logout } from '../support/app.po';

import { gotoAdminDashboard } from "../support/app.po";

describe('Test admin links', () => {
  
  beforeEach(function() {
    gotoAdminDashboard();
  });

  afterEach(function() {
    logout();
  });

  it('should show admin dashboard as entry page', () => {
    cy.url().should('match', /.*\/admin$/);
    cy.get('#admin-dashboard').should('be.visible');
  });

  it('should be able to follow path admin -> staff -> agent to agents setting', () => {
    cy.get('#admin-dashboard #admin-staff').click();
    cy.get('#admin-staff #admin-staff-agent').click();
    cy.get('#admin-staff-agent #user-selector').should('be.visible');
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


