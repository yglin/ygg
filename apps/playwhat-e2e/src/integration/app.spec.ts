describe('Play What Landing Page', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    cy.get('h2#greeting').contains('歡迎造訪 Play What');
  });

  it('should has link to scheduler', () => {
    cy.get('a#scheduler').should('have.text', '排個遊程');
    cy.get('a#scheduler').click();
    cy.url().should('include', 'scheduler');
  });
  
});
