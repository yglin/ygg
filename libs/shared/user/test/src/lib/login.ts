import { LoginDialogPageObjectCypress } from './login-dialog.po';
import { AccountWidgetPageObjectCypress } from './account-widget.po';
import { User, TestAccount } from '@ygg/shared/user/core';
import { getEnv } from '@ygg/shared/infra/core';
import { theMockDatabase } from '@ygg/shared/test/cypress';

export function waitForLogin(): Cypress.Chainable<any> {
  const accountWidgetPO = new AccountWidgetPageObjectCypress();
  return accountWidgetPO.expectLoggedIn();
}

export function login(provider: string) {
  const accountWidgetPO = new AccountWidgetPageObjectCypress();
  accountWidgetPO.login();
  const loginDialogPO = new LoginDialogPageObjectCypress();
  loginDialogPO.expectVisible();
  switch (provider) {
    case 'google':
      loginDialogPO.loginGoogle();
      break;
    case 'facebook':
      loginDialogPO.loginFacebook();
      break;
    default:
      break;
  }
  loginDialogPO.expectClosed({ timeout: 30000 });
  accountWidgetPO.expectLoggedIn();
}

export function loginTestUser(
  user: User,
  options: {
    openLoginDialog: boolean;
  } = {
    openLoginDialog: true
  }
): Cypress.Chainable<any> {
  const accountWidgetPO = new AccountWidgetPageObjectCypress();
  const loginDialogPO = new LoginDialogPageObjectCypress();
  if (options.openLoginDialog) {
    accountWidgetPO.login();
    loginDialogPO.expectVisible();
  }
  const account: TestAccount = {
    email: user.email,
    password: user.password
  };
  loginDialogPO.loginTest(account);
  return accountWidgetPO.expectLoggedIn();
}
