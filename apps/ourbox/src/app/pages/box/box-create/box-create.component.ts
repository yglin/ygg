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
import {
  ImitationBox,
  ImitationBoxCells,
  ImitationBoxFlags,
  ImitationBoxThumbnailImages
} from '@ygg/ourbox/core';
import { BoxFactoryService } from '../../../box-factory.service';
import { combineLatest, Subscription } from 'rxjs';
import { Image } from '@ygg/shared/omni-types/core';
import { ImageUploaderService } from '@ygg/shared/omni-types/ui';

@Component({
  selector: 'ygg-box-create',
  templateUrl: './box-create.component.html',
  styleUrls: ['./box-create.component.css']
})
export class BoxCreateComponent implements OnInit, OnDestroy {
  firstFormGroup: FormGroup;
  // secondFormGroup: FormGroup;
  formControlMemberEmail: FormControl = new FormControl('', [Validators.email]);
  formControlPublic: FormControl = new FormControl(false);
  members: { [email: string]: { id: string } } = {};
  foundUsers: User[] = [];
  isEmail = isEmail;
  isPublicDescription = ImitationBoxFlags.isPublic.description;
  subscriptions: Subscription[] = [];
  thumbnailImages = ImitationBoxThumbnailImages;
  thumbSelected: string;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private boxFactory: BoxFactoryService,
    private imageUploader: ImageUploaderService
  ) {
    this.firstFormGroup = this.formBuilder.group({
      name: [null, Validators.required]
    });
    const inputEmailChange$ = this.formControlMemberEmail.valueChanges.pipe(
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

    // this.formControlMemberEmail.valueChanges
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
      image: this.thumbSelected,
      memberEmails: keys(this.members),
      isPublic: this.formControlPublic.value
    });
  }

  addMember() {
    const email = this.formControlMemberEmail.value;
    if (isEmail(email)) {
      const foundUser = find(this.foundUsers, user => user.email === email);
      this.members[email] = { id: !!foundUser ? foundUser.id : null };
      this.formControlMemberEmail.setValue(null, { emitEvent: false });
    }
  }

  deleteMember(email: string) {
    if (email in this.members) {
      delete this.members[email];
    }
  }

  async addImages() {
    const images: Image[] = await this.imageUploader.uploadImages();
    if (!isEmpty(images)) {
      this.thumbnailImages.push(...images.map(img => img.src));
    }
  }
}
