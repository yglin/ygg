import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../models/user';
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

@Component({
  selector: 'ygg-account-widget',
  templateUrl: './account-widget.component.html',
  styleUrls: ['./account-widget.component.css']
})
export class AccountWidgetComponent implements OnInit, OnDestroy {
  user: User;
  isViewPortXSmall = false;
  subscriptions: Subscription[] = [];

  constructor(
    private authenticateService: AuthenticateService,
    private authenticateUiService: AuthenticateUiService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
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
      this.authenticateService.currentUser$.subscribe(
        user => (this.user = user)
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
}
