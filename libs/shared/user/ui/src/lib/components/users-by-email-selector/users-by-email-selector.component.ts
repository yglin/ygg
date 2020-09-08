import isEmail from 'validator/lib/isEmail';
import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import {
  FormControl,
  Validators,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor
} from '@angular/forms';
import { User, IUsersByEmail } from '@ygg/shared/user/core';
import { Subscription, combineLatest, Observable, Subject } from 'rxjs';
import { UserService } from '../../user.service';
import { debounceTime, filter, tap, startWith } from 'rxjs/operators';
import { find, noop, keys } from 'lodash';
import { YggDialogContentComponent } from '@ygg/shared/ui/widgets';

@Component({
  selector: 'ygg-users-by-email-selector',
  templateUrl: './users-by-email-selector.component.html',
  styleUrls: ['./users-by-email-selector.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UsersByEmailSelectorComponent),
      multi: true
    }
  ]
})
export class UsersByEmailSelectorComponent
  implements OnInit, OnDestroy, ControlValueAccessor, YggDialogContentComponent {
  formControlEmail: FormControl = new FormControl('', [Validators.email]);
  usersByEmail: IUsersByEmail = {};
  foundUsers: User[] = [];
  isEmail = isEmail;
  dialogData: any;
  dialogOutput$: Subject<any> = new Subject();
  subscriptions: Subscription[] = [];
  onChange: (emails: string[]) => any = noop;
  onTouched: () => any = noop;

  constructor(private userService: UserService) {
    const inputEmailChange$ = this.formControlEmail.valueChanges.pipe(
      debounceTime(300),
      filter(value => !value || (value && value.length >= 3)),
      startWith('')
    );
    this.subscriptions.push(
      combineLatest([inputEmailChange$, this.userService.listAll$()])
        .pipe(
          tap(([emailKeyword, users]) => {
            this.foundUsers = users.filter(user => {
              if (!emailKeyword) {
                return true;
              }
              if (user.email && user.email.includes(emailKeyword)) {
                return true;
              }
            });
          })
        )
        .subscribe()
    );
  }

  emitChange() {
    this.onChange(keys(this.usersByEmail));
    this.dialogOutput$.next(this.usersByEmail);
  }

  writeValue(emails: string[]): void {
    this.usersByEmail = {};
    for (const email of emails) {
      if (isEmail(email)) {
        const foundUser = find(this.foundUsers, user => user.email === email);
        this.usersByEmail[email] = !!foundUser ? foundUser : null ;
      }
    }
    this.formControlEmail.setValue(null, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // setDisabledState?(isDisabled: boolean): void {
  //   throw new Error('Method not implemented.');
  // }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  addEmail() {
    const email = this.formControlEmail.value;
    if (isEmail(email)) {
      const foundUser = find(this.foundUsers, user => user.email === email);
      this.usersByEmail[email] = !!foundUser ? foundUser : null;
      this.formControlEmail.setValue(null, { emitEvent: false });
      this.emitChange();
    }
  }

  deleteEmail(email: string) {
    if (email in this.usersByEmail) {
      delete this.usersByEmail[email];
      this.emitChange();
    }
  }
}
