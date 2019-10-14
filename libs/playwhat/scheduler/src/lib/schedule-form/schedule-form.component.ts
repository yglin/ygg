import { extend, isEmpty, eachRight } from 'lodash';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';
import { NumberRange, Contact, DateRange } from '@ygg/shared/types';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { first, switchMap, map } from 'rxjs/operators';

import { ScheduleForm } from './schedule-form';
import { ScheduleFormService } from './schedule-form.service';
import {
  User,
  AuthenticateService,
  UserService,
  AuthenticateUiService
} from '@ygg/shared/user';
import { SchedulerAdminService } from '../admin/scheduler-admin.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Tags } from '@ygg/tags/core';

@Component({
  selector: 'ygg-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit, OnDestroy {
  @Input() formGroup: FormGroup;
  @Input() scheduleForm: ScheduleForm;
  @Output() onSubmit: EventEmitter<ScheduleForm>;

  budgetType = 'total';
  budgetHintMessage = '';
  needTranspotationHelp = false;
  needAccommodationHelp = false;
  subscriptions: Subscription[];
  currentUser: User;
  agentUsers: User[];
  playTags$: Observable<Tags>;

  constructor(
    private formBuilder: FormBuilder,
    private schedulerAdminService: SchedulerAdminService,
    private scheduleFormService: ScheduleFormService,
    private authService: AuthenticateService,
    private authUiService: AuthenticateUiService,
    private userService: UserService,
  ) {
    this.onSubmit = new EventEmitter();
    this.subscriptions = [];
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          this.currentUser = user;
        } else {
          this.currentUser = null;
        }
      })
    );
    this.agentUsers = [];
    this.schedulerAdminService
      .getData$<string[]>('agent')
      .pipe(
        switchMap(agentIds => {
          return this.userService.listByIds$(agentIds);
        })
      )
      .subscribe(agentUsers => {
        if (!isEmpty(agentUsers)) {
          this.agentUsers = agentUsers;
        } else {
          this.agentUsers = [];
        }
      });
    // this.playTags$ = this.playTagService.playTags$.pipe(
    //   map(playTags => new Tags(playTags))
    // );
  }

  ngOnInit() {
    if (!this.formGroup) {
      this.formGroup = this.createFormGroup();
    }
    if (this.scheduleForm) {
      this.formGroup.patchValue(this.scheduleForm);
      this.setContacts(this.scheduleForm.contacts);
    } else {
      this.scheduleForm = new ScheduleForm();
    }
    let subsc: Subscription;
    // Sync data between scheduleForm and formGroup
    subsc = this.formGroup.valueChanges.subscribe(formGroupValue => {
      extend(this.scheduleForm, formGroupValue);
    });
    this.subscriptions.push(subsc);

    // Show budget hint message
    const formControlNumParticipants = this.formGroup.get('numParticipants');
    const formControlTotalBudget = this.formGroup.get('totalBudget');
    subsc = combineLatest([
      formControlNumParticipants.valueChanges as Observable<number>,
      formControlTotalBudget.valueChanges as Observable<NumberRange>
    ]).subscribe(([numParticipants, totalBudget]) => {
      // console.log(totalBudget);
      if (numParticipants > 0 && NumberRange.isNumberRange(totalBudget)) {
        const singleMax = Math.ceil(totalBudget.max / numParticipants);
        this.budgetHintMessage = `您正在調總預算，單人預算上限應調整為${singleMax}`;
      }
    });
    this.subscriptions.push(subsc);
    const formControlSingleBudget = this.formGroup.get('singleBudget');
    subsc = combineLatest([
      formControlNumParticipants.valueChanges as Observable<number>,
      formControlSingleBudget.valueChanges as Observable<NumberRange>
    ]).subscribe(([numParticipants, singleBudget]) => {
      if (numParticipants > 0 && NumberRange.isNumberRange(singleBudget)) {
        const totalMax = Math.ceil(singleBudget.max * numParticipants);
        this.budgetHintMessage = `您正在調單人預算，總預算上限應調整為${totalMax}`;
      }
    });
    this.subscriptions.push(subsc);
    subsc = this.formGroup.get('tags').valueChanges.subscribe(tags => {
      if (Tags.isTags(tags)) {
        this.scheduleForm.tags = tags;
      }
    });
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onChangeNeedAccommodationHelp(event: MatCheckboxChange) {
    const controlAccommodationHelp = this.formGroup.get('accommodationHelp');
    if (event.checked) {
      controlAccommodationHelp.enable();
    } else {
      controlAccommodationHelp.disable();
    }
  }

  setContacts(contacts: Contact[] = []) {
    while (this.contactsFormArray.length > 0) {
      this.contactsFormArray.removeAt(this.contactsFormArray.length - 1);
    }
    for (const contact of contacts) {
      if (Contact.isContact(contact)) {
        this.addContactControl(contact);
      }
    }
  }

  substituteContactWithCurrentUser(index: number) {
    if (this.currentUser && index < this.contactsFormArray.length) {
      const contactControl = this.contactsFormArray.at(index);
      contactControl.setValue(new Contact().fromUser(this.currentUser));
    }
  }

  // addContactFromCurrentUser() {
  //   if (this.currentUser) {
  //     this.addContactControl(new Contact().fromUser(this.currentUser));
  //   }
  // }

  get contactsFormArray() {
    return this.formGroup.get('contacts') as FormArray;
  }

  clearAllContacts() {
    this.contactsFormArray.clear();
  }

  addContactControl(contact?: Contact) {
    const contactControl = new FormControl();
    if (contact) {
      contactControl.setValue(contact);
    }
    this.contactsFormArray.push(contactControl);
  }

  deleteContact(index: number) {
    this.contactsFormArray.removeAt(index);
  }

  createFormGroup(): FormGroup {
    const formGroup = this.formBuilder.group({
      dateRange: [DateRange.forge(), Validators.required],
      numParticipants: [null, Validators.required],
      numElders: 0,
      numKids: 0,
      totalBudget: null,
      singleBudget: null,
      groupName: '',
      contacts: this.formBuilder.array([new FormControl()]),
      transpotation: '',
      transpotationHelp: '',
      accommodationHelp: new FormControl({ value: '', disabled: true }),
      tags: [],
      likesDescription: '',
      agentId: null
    });
    return formGroup;
  }

  isError(controlName: string, errorName: string): boolean {
    const control = this.formGroup.get(controlName);
    return control.touched && control.hasError(errorName);
  }

  onSelectResources(resourceIds: string[]) {
    // this.selectedResourceIds$.next(resourceIds);
  }

  async askForLogin(): Promise<User> {
    const messageAskLogin = `您尚未登入，是否要登入帳戶以方便您日後能追蹤此表單的狀態？`;
    if (confirm(messageAskLogin)) {
      try {
        return await this.authUiService.openLoginDialog();
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      return Promise.resolve(null);
    }
  }

  async submit() {
    if (confirm('確定已填寫完畢，要送出需求嗎？')) {
      if (this.currentUser) {
        this.scheduleForm.creatorId = this.currentUser.id;
      } else {
        this.currentUser = await this.askForLogin();
        if (this.currentUser) {
          this.scheduleForm.creatorId = this.currentUser.id;
        }
      }
      await this.scheduleFormService.upsert(this.scheduleForm);
      alert('已成功更新／新增需求資料');
      this.onSubmit.emit(this.scheduleForm);
    }
  }
}
