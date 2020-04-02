import { PageObject } from '@ygg/shared/test/page-object';
import { UserMenuPageObject } from '../user-menu/user-menu.component.po';

export abstract class AccountWidgetPageObject extends PageObject {
  selectors = {
    main: '.account-widget',
    loggedInWidget: '.logged-in',
    loggedOutWidget: '.logged-out',
    buttonLogin: 'button.login',
  };
  userMenuPO: UserMenuPageObject;

  abstract login(): void;
  abstract expectLoggedIn(): void;
  abstract expectLoggedOut(): void;

  logout() {
    this.userMenuPO.logout();
  }
}
