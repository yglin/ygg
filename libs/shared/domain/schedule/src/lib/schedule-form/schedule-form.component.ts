import {extend} from 'lodash';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {NumberRange, Tags} from '@ygg/shared/infrastructure/utility-types';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {first} from 'rxjs/operators';

import {ScheduleForm} from './schedule-form';
import {ScheduleFormService} from './schedule-form.service';

@Component({
  selector: 'ygg-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.css']
})
export class ScheduleFormComponent implements OnInit, OnDestroy {
  @Input() formGroup: FormGroup;
  @Input() scheduleForm: ScheduleForm;
  @Output() onSubmit: EventEmitter<ScheduleForm>;
  likesSource$: Observable<Tags>;
  budgetType = 'total';
  budgetHintMessage = '';
  needTranspotationHelp = false;
  needAccommodationHelp = false;
  subscriptions: Subscription[];

  constructor(private scheudleFormService: ScheduleFormService) {
    this.onSubmit = new EventEmitter();
    this.likesSource$ = this.scheudleFormService.listLikes$();
    this.subscriptions = [];
  }

  get contactsFormArray() {
    return this.formGroup.get('contacts') as FormArray;
  }

  addContact() {
    this.contactsFormArray.push(new FormControl());
  }

  deleteContact(index: number) {
    this.contactsFormArray.removeAt(index);
  }

  ngOnInit() {
    if (!this.formGroup) {
      this.formGroup = this.scheudleFormService.createFormGroup();
    }
    if (this.scheduleForm) {
      this.formGroup.patchValue(this.scheduleForm);
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
    subsc =
        combineLatest([
          (formControlNumParticipants.valueChanges as Observable<number>),
          (formControlTotalBudget.valueChanges as Observable<NumberRange>)
        ]).subscribe(([numParticipants, totalBudget]) => {
          // console.log(totalBudget);
          if (numParticipants > 0 && NumberRange.isNumberRange(totalBudget)) {
            const singleMax = Math.ceil(totalBudget.max / numParticipants);
            this.budgetHintMessage = `您正在調總預算，單人預算上限應調整為${singleMax}`;
          }
        });
    this.subscriptions.push(subsc);
    const formControlSingleBudget = this.formGroup.get('singleBudget');
    subsc =
        combineLatest([
          (formControlNumParticipants.valueChanges as Observable<number>),
          (formControlSingleBudget.valueChanges as Observable<NumberRange>)
        ]).subscribe(([numParticipants, singleBudget]) => {
          if (numParticipants > 0 && NumberRange.isNumberRange(singleBudget)) {
            const totalMax = Math.ceil(singleBudget.max * numParticipants);
            this.budgetHintMessage = `您正在調單人預算，總預算上限應調整為${totalMax}`;
          }
        });
    this.subscriptions.push(subsc);
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  isError(controlName: string, errorName: string): boolean {
    const control = this.formGroup.get(controlName);
    return control.touched && control.hasError(errorName);
  }

  onSelectResources(resourceIds: string[]) {
    // this.selectedResourceIds$.next(resourceIds);
  }

  submit() {
    if (confirm('確定已填寫完畢，要送出需求嗎？')) {
      this.scheudleFormService.upsert(this.scheduleForm).then(() => {
        alert('已成功更新／新增需求資料');
        this.onSubmit.emit(this.scheduleForm);
      });
    };
  }
}
