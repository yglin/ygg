import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../authenticate.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'ygg-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {

  constructor(
    private authenticateService: AuthenticateService,
    private dialogRef: MatDialogRef<LoginDialogComponent>
  ) { }

  ngOnInit() {
  }

  login(provider: string) {
    this.authenticateService.login(provider).then(() => this.dialogRef.close());
  }

  loginAnonymously() {
    this.authenticateService.loginAnonymously().then(() => this.dialogRef.close());
  }
}
