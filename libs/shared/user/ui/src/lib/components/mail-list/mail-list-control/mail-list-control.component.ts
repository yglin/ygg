import isEmail from 'validator/lib/isEmail';
import { Component, OnInit, forwardRef } from '@angular/core';
import {
  FormControl,
  Validators,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor
} from '@angular/forms';
import { User } from '@ygg/shared/user/core';
import { Subscription, combineLatest, Observable, Subject } from 'rxjs';
import { UserService } from '../../../user.service';
import { debounceTime, filter, tap, startWith } from 'rxjs/operators';
import { find, noop, keys } from 'lodash';
import { YggDialogContentComponent } from '@ygg/shared/ui/widgets';

@Component({
  selector: 'ygg-mail-list-control',
  templateUrl: './mail-list-control.component.html',
  styleUrls: ['./mail-list-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MailListControlComponent),
      multi: true
    }
  ]
})
export class MailListControlComponent
  implements OnInit, ControlValueAccessor, YggDialogContentComponent {
  formControlEmail: FormControl = new FormControl('', [Validators.email]);
  emails: { [email: string]: { id: string } } = {};
  foundUsers: User[] = [];
  isEmail = isEmail;
  dialogData: any;
  dialogOutput$: Subject<any> = new Subject();
  onChange: (emails: string[]) => any = noop;
  onTouched: () => any = noop;
  subscriptions: Subscription[] = [];

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
    const emails = keys(this.emails);
    this.onChange(emails);
    this.dialogOutput$.next(emails);
  }

  writeValue(emails: string[]): void {
    this.emails = {};
    for (const email of emails) {
      if (isEmail(email)) {
        const foundUser = find(this.foundUsers, user => user.email === email);
        this.emails[email] = { id: !!foundUser ? foundUser.id : null };
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

  ngOnInit(): void {
    if (this.dialogData && this.dialogData.emails) {
      this.writeValue(this.dialogData.emails);
    }
  }

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
      this.emails[email] = { id: !!foundUser ? foundUser.id : null };
      this.formControlEmail.setValue(null, { emitEvent: false });
      this.emitChange();
    }
  }

  deleteEmail(email: string) {
    if (email in this.emails) {
      delete this.emails[email];
      this.emitChange();
    }
  }
}
