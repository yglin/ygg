import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { AuthenticateService } from '../../authenticate.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { AuthenticateUiService } from '../../authenticate-ui.service';

@Component({
  selector: 'ygg-account-widget',
  templateUrl: './account-widget.component.html',
  styleUrls: ['./account-widget.component.css']
})
export class AccountWidgetComponent implements OnInit {
  user: User;

  constructor(
    private authenticateService: AuthenticateService,
    private authenticateUiService: AuthenticateUiService
  ) {}

  ngOnInit() {
    this.authenticateService.currentUser$.subscribe(user => (this.user = user));
  }

  login() {
    this.authenticateUiService.openLoginDialog();
  }

  logout() {
    this.authenticateService.logout();
  }
}
