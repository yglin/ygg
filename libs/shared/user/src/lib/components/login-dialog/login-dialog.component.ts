import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticateService } from '../../authenticate.service';
import { MatDialogRef } from '@angular/material';
import { skip } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { User } from '../../models/user';

@Component({
  selector: 'ygg-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  constructor(
    private authenticateService: AuthenticateService,
    private dialogRef: MatDialogRef<LoginDialogComponent>
  ) {
    this.subscriptions.push(
    this.authenticateService.currentUser$.pipe(skip(1)).subscribe(user => {
      if (User.isUser(user)) {
        this.dialogRef.close(user);
      }
    }));
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
  
  login(provider: string) {
    this.authenticateService.login(provider);
  }

  loginAnonymously() {
    this.authenticateService.loginAnonymously();
  }
}
