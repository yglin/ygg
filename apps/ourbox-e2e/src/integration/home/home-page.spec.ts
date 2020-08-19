describe('Ourbox home page, as guest(not login)', () => {
  before(() => {
    cy.visit('/');
  });

  it('Should show link of map-search', () => {
    cy.get('a.map-search').click({ force: true });
  });
});
