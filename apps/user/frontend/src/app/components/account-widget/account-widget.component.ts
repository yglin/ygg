import { Component, OnInit } from '@angular/core';
import { User } from '@ygg/shared/user';
import { AuthenticateService } from '@ygg/shared/user';
import { MatDialog } from '@angular/material';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

@Component({
  selector: 'ygg-account-widget',
  templateUrl: './account-widget.component.html',
  styleUrls: ['./account-widget.component.css']
})
export class AccountWidgetComponent implements OnInit {
  user: User;

  constructor(
    private authenticateService: AuthenticateService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.authenticateService.currentUser$.subscribe(user => (this.user = user));
  }

  login() {
    this.dialog.open(LoginDialogComponent);
  }

  logout() {
    this.authenticateService.logout();
  }
}
