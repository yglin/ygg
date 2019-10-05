describe('Play What Landing Page', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    cy.get('h2#greeting').contains('歡迎造訪 Play What');
  });
});
