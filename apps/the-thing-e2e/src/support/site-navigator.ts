import { SiteNavigator } from '@ygg/shared/test/cypress';

export const siteNavigator = new SiteNavigator({
  path: '/',
  routeMethod: () => {
    cy.get('.header button#to-home').click({ force: true });
  },
  children: [
    {
      path: 'cells',
      routeMethod: () => {
        cy.get('a#cell-list').click({ force: true });
      },
      children: []
    }
  ]
});
