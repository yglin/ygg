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
import { combineLatest, Observable, Subscription, merge } from 'rxjs';
import { first, switchMap, map, startWith, debounceTime, single } from 'rxjs/operators';
import { Play, PlayService } from "@ygg/playwhat/play";
import { SchedulePlan } from '@ygg/schedule/core';
import {
  SchedulePlanService,
  ScheduleConfigService
} from '@ygg/schedule/data-access';
import {
  User,
  AuthenticateService,
  UserService,
  AuthenticateUiService
} from '@ygg/shared/user';
import { Tags } from '@ygg/tags/core';
import { TranspotationTypes } from '@ygg/schedule/core';
import { ActivatedRoute } from '@angular/router';
import { Purchase, ShoppingCartService } from '@ygg/shopping/core';

@Component({
  selector: 'ygg-schedule-plan-control',
  templateUrl: './schedule-plan-control.component.html',
  styleUrls: ['./schedule-plan-control.component.css']
})
export class SchedulePlanControlComponent implements OnInit, OnDestroy {
  @Input() formGroup: FormGroup;
  @Input() schedulePlan: SchedulePlan;
  @Output() submit: EventEmitter<SchedulePlan> = new EventEmitter();
  @Output() valueChanged: EventEmitter<SchedulePlan> = new EventEmitter();

  budgetType = 'single';
  budgetHintMessage = '';
  // needTranspotationHelp = false;
  needAccommodationHelp = false;
  subscriptions: Subscription[];
  currentUser: User;
  agentUsers: User[];
  playTags$: Observable<Tags>;
  transpotationTypes = TranspotationTypes;
  playsAll: Play[];
  // purchases: Purchase[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private scheduleConfigService: ScheduleConfigService,
    private schedulePlanService: SchedulePlanService,
    private authService: AuthenticateService,
    private authUiService: AuthenticateUiService,
    private userService: UserService,
    private playService: PlayService,
    private shoppingCart: ShoppingCartService
  ) {
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
    this.subscriptions.push(this.playService.list$().subscribe(plays => {
      this.playsAll = plays;
    }));
    this.agentUsers = [];
    this.scheduleConfigService
      .get$('agents')
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
    let subsc: Subscription;
    if (!this.formGroup) {
      this.formGroup = this.createFormGroup();
    }
    if (this.schedulePlan) {
      this.schedulePlan = this.schedulePlan.clone();
      this.formGroup.patchValue(this.schedulePlan);
      this.setContacts(this.schedulePlan.contacts);
    } else {
      this.schedulePlan = new SchedulePlan();
    }
    // Sync data between schedulePlan and formGroup
    subsc = this.formGroup.valueChanges.subscribe(schedulePlanValue => {
      const schedulePlan = this.schedulePlan.clone();
      extend(schedulePlan, schedulePlanValue);
      this.valueChanged.emit(schedulePlan);
    });
    this.subscriptions.push(subsc);

    // Show budget hint message
    const formControlNumParticipants = this.formGroup.get('numParticipants');
    const formControlTotalBudget = this.formGroup.get('totalBudget');
    const formControlSingleBudget = this.formGroup.get('singleBudget');
    subsc = formControlTotalBudget.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => {
        const numParticipants = formControlNumParticipants.value;
        const totalBudget = formControlTotalBudget.value;
        // console.log(`totalBudget changed to ${totalBudget.toJSON()}`);
        if (numParticipants > 0 && NumberRange.isNumberRange(totalBudget)) {
          const singleBudget = new NumberRange(
            Math.floor(totalBudget.min / numParticipants),
            Math.floor(totalBudget.max / numParticipants)
          );
          // console.log(`Update singleBudget ${singleBudget.toJSON()}`);
          formControlSingleBudget.setValue(singleBudget, { emitEvent: false });
        }
      });
    this.subscriptions.push(subsc);

    subsc = formControlSingleBudget.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => {
        const numParticipants = formControlNumParticipants.value;
        const singleBudget = formControlSingleBudget.value;
        // console.log(`singleBudget changed to ${singleBudget.toJSON()}`);
        if (numParticipants > 0 && NumberRange.isNumberRange(singleBudget)) {
          const totalBudget = new NumberRange(
            singleBudget.min * numParticipants,
            singleBudget.max * numParticipants
          );
          // console.log(`Update totalBudget ${totalBudget.toJSON()}`);
          formControlTotalBudget.setValue(totalBudget, { emitEvent: false });
        }
      });
    this.subscriptions.push(subsc);

    subsc = formControlNumParticipants.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      const numParticipants = formControlNumParticipants.value;
      let singleBudget = formControlSingleBudget.value;
      let totalBudget = formControlTotalBudget.value;
      // console.log(`numParticipants changed to ${numParticipants}`);
      if (numParticipants > 0 ) {
        if (NumberRange.isNumberRange(singleBudget)) {
          totalBudget = new NumberRange(
            singleBudget.min * numParticipants,
            singleBudget.max * numParticipants
          );
          // console.log(`Update totalBudget ${totalBudget.toJSON()}`);
          formControlTotalBudget.setValue(totalBudget, { emitEvent: false });          
        } else if (NumberRange.isNumberRange(totalBudget)) {
          singleBudget = new NumberRange(
            Math.floor(totalBudget.min / numParticipants),
            Math.floor(totalBudget.max / numParticipants)
          );
          // console.log(`Update singleBudget ${singleBudget.toJSON()}`);
          formControlSingleBudget.setValue(singleBudget, { emitEvent: false });
        }
      }
    });
    this.subscriptions.push(subsc);

    subsc = this.formGroup.get('tags').valueChanges.subscribe(tags => {
      if (Tags.isTags(tags)) {
        this.schedulePlan.tags = tags;
      }
    });
    this.subscriptions.push(subsc);
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
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

  addPlayPurchase(play: Play) {
    const newPurchase = new Purchase(play, this.formGroup.get('numParticipants').value);
    this.shoppingCart.addPurchase(newPurchase);
  }

  createFormGroup(): FormGroup {
    const formGroup = this.formBuilder.group({
      dateRange: [null, Validators.required],
      numParticipants: [null, Validators.required],
      numElders: 0,
      numKids: 0,
      totalBudget: null,
      singleBudget: null,
      groupName: '',
      contacts: this.formBuilder.array([new FormControl()]),
      transpotation: '',
      transpotationHelp: '',
      accommodationHelp: '',
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

  async onSubmit() {
    if (confirm('確定已填寫完畢，要送出需求嗎？')) {
      const schedulePlan = this.schedulePlan.clone();
      extend(schedulePlan, this.formGroup.value);
      if (!schedulePlan.creatorId) {
        if (this.currentUser) {
          schedulePlan.creatorId = this.currentUser.id;
        } else {
          this.currentUser = await this.askForLogin();
          if (this.currentUser) {
            schedulePlan.creatorId = this.currentUser.id;
          }
        }
      }
      await this.schedulePlanService.upsert(schedulePlan);
      alert('已成功更新／新增遊程需求');
      this.submit.emit(schedulePlan);
    }
  }
}
