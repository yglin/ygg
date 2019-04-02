import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../authenticate.service';
import { UserMenuItem, UserMenuService } from './user-menu.service';

@Component({
  selector: 'ygg-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
})
export class UserMenuComponent implements OnInit {
  menuItems: UserMenuItem[];

  constructor(
    private authenticateService: AuthenticateService,
    private userMenuService: UserMenuService
  ) {}

  ngOnInit() {
    this.userMenuService.menuItems$.subscribe(
      menuItems => (this.menuItems = menuItems)
    );
  }

  logout() {
    this.authenticateService.logout();
  }
}
