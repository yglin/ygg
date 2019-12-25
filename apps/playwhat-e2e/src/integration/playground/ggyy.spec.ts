describe('External sites', () => {
  it('youtube', () => {
    cy.visit('www.youtube.com');
    cy.get('#search-input > #search').clear().type('台灣');
    cy.get('#search-icon-legacy').click();
    cy.get('#contents > :nth-child(1) > #dismissable > ytd-thumbnail.style-scope > #thumbnail > .no-transition > #img').click();
  });
});
