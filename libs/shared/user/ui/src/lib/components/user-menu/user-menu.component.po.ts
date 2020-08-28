import { PageObject } from '@ygg/shared/test/page-object';

export abstract class UserMenuPageObject extends PageObject {
  selectors = {
    main: '.user-menu',
    menuTrigger: '.menu-trigger'
  };

  abstract open(): void;
  abstract logout(): void;
  abstract clickMenuItem(itemId: string): void;
}
