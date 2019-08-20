import { getGreeting } from '../support/app.po';

describe('shared-types-demo', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to shared-types-demo!');
  });
});
