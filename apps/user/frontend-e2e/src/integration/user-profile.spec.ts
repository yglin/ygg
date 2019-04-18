import {loginAnonymously} from '../support/app.po';
describe('Navigation over pages', () => {
  beforeEach(function() {
    cy.visit('/');
  });

  describe('As a logged in user', () => {
    beforeEach(function() {
      loginAnonymously();
    });

    it('should be able to access user profile page and show user profile', () => {
      cy.get('div#account-widget').click();
      cy.get('div#user-menu').get('button#profile').click();
      cy.get('div#user-profile').should('be.visible');
      cy.get('div#user-thumbnail').should('be.visible');
      cy.get('div#user-state').should('be.visible');
      cy.get('div#user-email').should('be.visible');
      cy.get('div#user-phone').should('be.visible');
    });

    it('should back to home page after logout', () => {
      cy.get('div#account-widget').click();
      cy.get('div#user-menu').get('button#profile').click();
      cy.get('div#user-profile').should('be.visible');
      cy.get('div#account-widget').click();
      cy.get('div#user-menu').get('button#logout').click();
      cy.location('pathname').should('eq', '/');
    });
    
  });
});