import { AccountWidgetPageObjectCypress } from './account-widget.po';

export function logout(): Cypress.Chainable<any> {
  const accountWidgetPO = new AccountWidgetPageObjectCypress();
  accountWidgetPO.logout();
  return accountWidgetPO.expectLoggedOut();
}
