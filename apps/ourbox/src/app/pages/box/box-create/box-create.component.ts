import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import isEmail from 'validator/lib/isEmail';
import { filter, tap, switchMap, debounceTime } from 'rxjs/operators';
import { UserService } from '@ygg/shared/user/ui';
import { isEmpty, find, remove, keys } from 'lodash';
import { User } from '@ygg/shared/user/core';
import { ImitationBox, ImitationBoxCells } from '@ygg/ourbox/core';
import { BoxFactoryService } from '../../../box-factory.service';
import { combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'ygg-box-create',
  templateUrl: './box-create.component.html',
  styleUrls: ['./box-create.component.css']
})
export class BoxCreateComponent implements OnInit, OnDestroy {
  firstFormGroup: FormGroup;
  // secondFormGroup: FormGroup;
  formControlFriendEmail: FormControl = new FormControl('', [Validators.email]);
  formControlPublic: FormControl = new FormControl(false);
  friends: { [email: string]: { id: string } } = {};
  foundUsers: User[] = [];
  isEmail = isEmail;
  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private boxFactory: BoxFactoryService
  ) {
    this.firstFormGroup = this.formBuilder.group({
      name: [null, Validators.required]
    });
    const inputEmailChange$ = this.formControlFriendEmail.valueChanges.pipe(
      debounceTime(300),
      filter(value => value && value.length >= 3)
    );
    this.subscriptions.push(
      combineLatest([inputEmailChange$, this.userService.listAll$()])
        .pipe(
          tap(([emailKeyword, users]) => {
            this.foundUsers = users.filter(
              user => user.email && user.email.includes(emailKeyword)
            );
          })
        )
        .subscribe()
    );

    // this.formControlFriendEmail.valueChanges
    //   .pipe(
    //     debounceTime(5000),
    //     filter(value => value && value.length >= 3),
    //     filter(keyword => {
    //       const foundUser = find(this.foundUsers, user => user.email === email);
    //       if (foundUser) {
    //         this.foundUser = foundUser;
    //         return false;
    //       } else {
    //         return true;
    //       }
    //     }),
    //     switchMap((email: string) =>
    //       this.userService.findWithIdOrEmail$(null, email)
    //     ),
    //     tap(users => (this.foundUsers = isEmpty(users) ? [] : users))
    //   )
    //   .subscribe();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  submit() {
    this.boxFactory.create({
      name: this.firstFormGroup.get('name').value,
      friendEmails: keys(this.friends),
      isPublic: this.formControlPublic.value
    });
  }

  addFriend() {
    const email = this.formControlFriendEmail.value;
    if (isEmail(email)) {
      const foundUser = find(this.foundUsers, user => user.email === email);
      this.friends[email] = { id: !!foundUser ? foundUser.id : null };
      this.formControlFriendEmail.setValue(null, { emitEvent: false });
    }
  }

  deleteFriend(email: string) {
    if (email in this.friends) {
      delete this.friends[email];
    }
  }
}
