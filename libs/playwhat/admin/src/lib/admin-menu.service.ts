import { values } from 'lodash';
import { Injectable } from '@angular/core';
import { MenuItem } from '@ygg/shared/ui/navigation';
import { BehaviorSubject } from 'rxjs';
import { Image } from '@ygg/shared/types';

@Injectable({
  providedIn: 'root'
})
export class AdminMenuService {
  menuItems: { [id: string]: MenuItem };
  menuItems$: BehaviorSubject<MenuItem[]>;

  constructor() {
    this.menuItems = {};
    this.menuItems$ = new BehaviorSubject([]);
    this.addItem({
      id: 'admin-staff',
      label: '角色人員',
      icon: new Image('/assets/images/admin/users.png'),
      link: 'staff',
      tooltip: '管理各帳號擔任的角色及工作人員'
    });
    this.addItem({
      id: 'admin-system',
      label: '系統設定',
      icon: new Image('/assets/images/admin/settings.png'),
      link: 'settings',
      tooltip: '網站系統設定'
    });
  }

  addItem(item: MenuItem) {
    this.menuItems[item.id] = item;
    this.menuItems$.next(values(this.menuItems));
  }

  removeItem(itemId: string) {
    if (itemId in this.menuItems) {
      delete this.menuItems[itemId];
      this.menuItems$.next(values(this.menuItems));
    }
  }
}
