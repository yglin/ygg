import { getGreeting } from '../support/app.po';

describe('the-thing', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to the-thing!');
  });
});
