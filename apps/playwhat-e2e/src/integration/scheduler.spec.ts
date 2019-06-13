describe('Scheduler', () => {
  beforeEach(function() {
    cy.visit('/scheduler');
  });
  
  it('New schedule shows schedule form', () => {
    cy.get('form#schedule-form').should('be.visible');
  });
});
