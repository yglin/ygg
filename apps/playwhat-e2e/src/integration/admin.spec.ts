import { loginAdmin, logout } from '../support/app.po';

import { gotoAdminDashboard } from "../support/app.po";

describe('Test admin links', () => {
  
  beforeEach(function() {
    gotoAdminDashboard();
  });

  afterEach(function() {
    logout();
  });

  it('should be able to follow path admin/scheduler/staff/agent to agents setting', () => {
    cy.url().should('match', /.*\/admin$/);
    cy.get('#scheduler').click();
    cy.url().should('match', /.*\/admin\/scheduler$/);
    cy.get('#staff').click();
    cy.url().should('match', /.*\/admin\/scheduler\/staff$/);
    cy.get('#agent').click();
    cy.url().should('match', /.*\/admin\/scheduler\/staff\/agent$/);
    cy.get('#user-selector').should('be.visible');
  });
  
  it('should be able to follow path admin/scheduler/forms to schedule-forms list table', () => {
    cy.url().should('match', /.*\/admin$/);
    cy.get('#scheduler').click();
    cy.url().should('match', /.*\/admin\/scheduler$/);
    cy.get('#forms').click();
    cy.url().should('match', /.*\/admin\/scheduler\/forms$/);
    cy.get('#schedule-forms-table').should('be.visible');
  });

  it('should follow path admin/play/tags to settings for play tags', () => {
    cy.url().should('match', /.*\/admin$/);
    cy.get('#play').click();
    cy.url().should('match', /.*\/admin\/play$/);
    cy.get('#tags').click();
    cy.url().should('match', /.*\/admin\/play\/tags$/);
    cy.get('#admin-play-tags').should('be.visible');
    // Should provide input to add new tag
    cy.get('#add-new-play-tag input').should('be.visible');
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


