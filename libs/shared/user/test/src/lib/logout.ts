import { AccountWidgetPageObjectCypress } from './account-widget.po';

export function logout() {
  const accountWidgetPO = new AccountWidgetPageObjectCypress();
  accountWidgetPO.logout();
  accountWidgetPO.expectLoggedOut();
}
