import { SiteNavigator } from '@ygg/shared/test/cypress';

export const siteNavigator = new SiteNavigator({
  path: '/',
  routeMethod: () => {
    cy.get('.pw-header #to-home').click({ force: true });
  },
  children: [
    {
      path: 'admin',
      routeMethod: () => {
        cy.get('#account-widget .menu-trigger').click({ force: true });
        cy.get('#user-menu button#admin').click({ force: true });
      },
      children: [
        {
          path: 'the-thing',
          routeMethod: () => {
            cy.get('#the-thing').click({ force: true });
          },
          children: [
            {
              path: 'cells',
              routeMethod: () => {
                cy.get('#cell-list').click({ force: true });
              },
              children: []
            }
          ]
        }
      ]
    }
  ]
});
