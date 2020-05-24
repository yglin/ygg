import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import isEmail from 'validator/lib/isEmail';
import { filter, tap, switchMap } from 'rxjs/operators';
import { UserService } from '@ygg/shared/user/ui';
import { isEmpty, find, remove } from 'lodash';
import { User } from '@ygg/shared/user/core';

@Component({
  selector: 'ygg-box-create',
  templateUrl: './box-create.component.html',
  styleUrls: ['./box-create.component.css']
})
export class BoxCreateComponent implements OnInit {
  firstFormGroup: FormGroup;
  // secondFormGroup: FormGroup;
  formControlFriendEmail: FormControl = new FormControl('', [Validators.email]);
  friends: string[] = [];
  foundUser: User;
  foundUsers: User[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.firstFormGroup = this.formBuilder.group({
      name: [null, Validators.required]
    });
    this.formControlFriendEmail.valueChanges
      .pipe(
        tap(() => (this.foundUser = undefined)),
        filter(value => value && value.length >= 3),
        filter(email => {
          const foundUser = find(this.foundUsers, user => user.email === email);
          if (foundUser) {
            this.foundUser = foundUser;
            return false;
          } else {
            return true;
          }
        }),
        switchMap((email: string) =>
          this.userService.findWithIdOrEmail$(null, email)
        ),
        tap(users => (this.foundUsers = isEmpty(users) ? [] : users))
      )
      .subscribe();
  }

  ngOnInit(): void {}

  isEmail(value: string): boolean {
    return isEmail(value);
  }

  submit() {}

  addFriend() {
    const email = this.formControlFriendEmail.value;
    const foundUser = find(this.foundUsers, user => user.email === email);
    const value = !!foundUser ? foundUser.id : email;
    if (this.friends.indexOf(value) < 0) {
      this.friends.push(value);
    }
  }

  deleteFriend(value: string) {
    remove(this.friends, f => f === value);
  }
}
