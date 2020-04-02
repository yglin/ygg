import { PageObject } from '@ygg/shared/test/page-object';

export abstract class UserMenuPageObject extends PageObject {
  selectors = {
    main: '.user-menu',
    menuTrigger: '.menu-trigger'
  };

  abstract logout(): void;
}
