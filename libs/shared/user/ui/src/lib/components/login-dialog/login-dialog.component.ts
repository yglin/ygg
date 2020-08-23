import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticateService } from '../../authenticate.service';
import { MatDialogRef } from '@angular/material/dialog';
import { skip } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { User } from '@ygg/shared/user/core';
import { get } from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { getEnv } from '@ygg/shared/infra/core';

@Component({
  selector: 'ygg-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  testEnabled = !!getEnv('test.account');
  formGroupTestAccount: FormGroup;

  constructor(
    private authenticateService: AuthenticateService,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    // console.log(this.testEnabled);
    this.subscriptions.push(
      this.authenticateService.currentUser$.pipe(skip(1)).subscribe(user => {
        if (User.isUser(user)) {
          this.dialogRef.close(user);
        }
      })
    );

    this.formGroupTestAccount = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  login(provider: string) {
    this.authenticateService.login(provider);
  }

  loginTestAccount() {
    this.authenticateService.loginTestAccount(this.formGroupTestAccount.value);
  }
}
