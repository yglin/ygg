import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticateService, AuthorizeService, UserMenuService, UserMenuItem } from '@ygg/shared/user';
import { Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'pw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'playwhat';
  subscriptions: Subscription[] = [];

  constructor(
    private authenticateService: AuthenticateService,
    private authorizeService: AuthorizeService,
    private userMenuService: UserMenuService
  ) {}

  ngOnInit() {
    // Check user admin
    const subscription = this.authenticateService.currentUser$.pipe(
      switchMap(currentUser => {
        if (currentUser) {
          return this.authorizeService.isAdmin(currentUser.id);
        } else {
          return of(false);
        }
      })
    ).subscribe(isAdmin => {
      const adminMenuItem: UserMenuItem = {
        id: 'admin',
        icon: 'business',
        label: '站務管理',
        link: 'admin'
      };
      if (isAdmin) {
        this.userMenuService.addItem(adminMenuItem);
      } else {
        this.userMenuService.removeItem(adminMenuItem.id);
      }
    });
    // Register user-menu-item admin

    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
