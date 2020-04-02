import { LoginDialogPageObjectCypress } from './login-dialog.po';
import { AccountWidgetPageObjectCypress } from './account-widget.po';

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
