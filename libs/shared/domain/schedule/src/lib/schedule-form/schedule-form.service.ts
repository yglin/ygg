import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
// import {DateRange, NumberRange} from '@ygg/shared/infrastructure/utility-types';
// import * as moment from 'moment';
import { ScheduleForm } from './schedule-form';
import { NumberRange } from '@ygg/shared/infrastructure/utility-types';

@Injectable({providedIn: 'root'})
export class ScheduleFormService {
  constructor(private formBuilder: FormBuilder) {}

  defaultForm(): ScheduleForm {
    const form = new ScheduleForm();
    // TODO: Auto-complete some values
    return form;
  }

  createFormGroup(): FormGroup {
    const formGroup = this.formBuilder.group({
      dateRange: [null, Validators.required],
      numParticipants: [null, Validators.required],
      totalBudget: new NumberRange(),
      singleBudget: new NumberRange(),
      groupName: '',
      contacts: this.formBuilder.array([
        new FormControl()
      ]),
      transpotation: ''
    });
    return formGroup;
  }
}
