import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '@ygg/shared/user/core';
import { AuthenticateService } from '../../authenticate.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { AuthenticateUiService } from '../../authenticate-ui.service';
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints
} from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { NotificationFactoryService } from '../../notification-factory.service';
import { size } from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'ygg-account-widget',
  templateUrl: './account-widget.component.html',
  styleUrls: ['./account-widget.component.css']
})
export class AccountWidgetComponent implements OnInit, OnDestroy {
  user: User;
  isViewPortXSmall = false;
  numNotifications = 0;
  subscriptions: Subscription[] = [];
  isLoggingIn = false;

  constructor(
    private authenticateService: AuthenticateService,
    private authenticateUiService: AuthenticateUiService,
    private breakpointObserver: BreakpointObserver,
    private notificationFactory: NotificationFactoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.authenticateService.toggleLoggingIn$.subscribe(
        isLoggingIn => (this.isLoggingIn = isLoggingIn)
      )
    );
    this.subscriptions.push(
      this.breakpointObserver
        .observe([Breakpoints.XSmall])
        .subscribe((state: BreakpointState) => {
          // console.log(`Viewport matches XSmall? ${state.matches}`);
          if (state.matches) {
            this.isViewPortXSmall = true;
          } else {
            this.isViewPortXSmall = false;
          }
        })
    );
    this.subscriptions.push(
      this.authenticateService.currentUser$.subscribe(user => {
        this.user = user;
      })
    );
    this.subscriptions.push(
      this.notificationFactory
        .getUnreadNotifications$()
        .subscribe(
          notifications => (this.numNotifications = size(notifications))
        )
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  login() {
    this.authenticateUiService.openLoginDialog();
  }

  logout() {
    this.authenticateService.logout();
  }

  gotoMyNotifications() {
    this.router.navigate(['/', 'notifications', 'my']);
  }
}
