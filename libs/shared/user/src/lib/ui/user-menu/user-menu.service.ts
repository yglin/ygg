import { values } from 'lodash';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthenticateService } from '../../authenticate.service';

export interface UserMenuItem {
  icon: string;
  label: string;
  link: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserMenuService {
  menuItems: { [key: string]: UserMenuItem };
  menuItems$: BehaviorSubject<UserMenuItem[]>;

  constructor(private authenticateService: AuthenticateService) {
    this.menuItems = {};
    this.menuItems$ = new BehaviorSubject(values(this.menuItems));
    this.authenticateService.currentUser$.subscribe(user => {
      if (user && user.id) {
        this.addItem({
          icon: 'account_box',
          label: '個人資料',
          link: `users/${user.id}`
        });
      }
    });
  }

  addItem(menuItem: UserMenuItem) {
    this.menuItems[menuItem.label] = menuItem;
    this.menuItems$.next(values(this.menuItems));
  }
}
