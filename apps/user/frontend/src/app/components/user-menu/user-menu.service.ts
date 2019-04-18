import { values } from 'lodash';
import { UserMenuItem } from './user-menu';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthenticateService } from '@ygg/shared/user';

@Injectable({
  providedIn: 'root'
})
export class UserMenuService {
  menuItems: { [id: string]: UserMenuItem };
  menuItems$: BehaviorSubject<UserMenuItem[]>;

  constructor(private authenticateService: AuthenticateService) {
    this.menuItems = {};
    this.menuItems$ = new BehaviorSubject(values(this.menuItems));
    this.authenticateService.currentUser$.subscribe(user => {
      if (user && user.id) {
        this.addItem({
          id: 'profile',
          icon: 'account_box',
          label: '個人資料',
          link: 'users/me'
        });
      }
    });
  }

  addItem(menuItem: UserMenuItem) {
    this.menuItems[menuItem.id] = menuItem;
    this.menuItems$.next(values(this.menuItems));
  }
}
