class SiteNavigator {
  goto(path: string[] = ['home']): Cypress.Chainable<any> {
    const fullPathName = `/${path.join('/')}`;
    cy.log(`Go to ${fullPathName}`);
    cy.get('.pw-header #to-home').click({ force: true });
    cy.location('pathname').should('eq', '/home');
    const route = path.shift();
    if (route === 'plays') {
      this.gotoPlays(path);
    } else if (route === 'admin') {
      this.gotoAdmin(path);
    } else if (route === 'scheduler') {
      if (path[0] === 'schedule-plans' && path[1] === 'new') {
        cy.get('a#new-schedule').click({force: true});
      } else {
        this.gotoScheduler(path);
      }
    } else {
      cy.visit(fullPathName);
    }
    return cy.location('pathname').should('eq', fullPathName);
  }
}