import { Page } from '@ygg/shared/ui/core';
import { extend } from 'lodash';

export class UserMenuItem {
  
  id: string;
  icon: string;
  label: string;
  link: string;

  static fromPage(page: Page): UserMenuItem {
    const menuItem = new UserMenuItem();
    extend(menuItem, page);
    menuItem.link = '/' + page.path.join('/');
    return menuItem;
  }

}
