import { values } from 'lodash';
import { Injectable } from '@angular/core';
import { GridMenuItem } from '@ygg/shared/ui/widgets';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminMenuService {
  menuItems: { [id: string]: GridMenuItem };
  menuItems$: BehaviorSubject<GridMenuItem[]>;

  constructor() {
    this.menuItems = {};
    this.menuItems$ = new BehaviorSubject([]);
    this.addItem({
      id: 'admin-staff',
      label: '角色人員',
      icon: 'supervised_user_circle',
      link: 'staff'
    });
    this.addItem({
      id: 'admin-system',
      label: '系統設定',
      icon: 'settings',
      link: 'settings'
    });
  }

  addItem(item: GridMenuItem) {
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
