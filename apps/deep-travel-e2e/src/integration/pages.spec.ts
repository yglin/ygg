import {loginAnonymously} from '../support/app.po';
describe('Navigation over pages', () => {
  beforeEach(function() {
    cy.visit('/');
  });

  describe('As a logged in user', () => {
    beforeEach(function() {
      loginAnonymously();
    });

    it('should be able to access user profile page', () => {
      cy.get('div#account-widget').click();
      cy.get('div#user-menu').get('button#profile').click();
      cy.get('div#user-profile').should('be.visible');
    });
  });
});