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

  it('should follow path admin/resource/tags to settings for resource tags', () => {
    cy.url().should('match', /.*\/admin$/);
    cy.get('#resource').click();
    cy.url().should('match', /.*\/admin\/resource$/);
    cy.get('#tags').click();
    cy.url().should('match', /.*\/admin\/resource\/tags$/);
    cy.get('#resource-tags-list').should('be.visible');
    cy.get('#resource-tags-creator').should('be.visible');
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


