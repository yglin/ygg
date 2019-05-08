import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DateRange, NumberRange} from '@ygg/shared/infrastructure/utility-types';
import * as moment from 'moment';

@Injectable({providedIn: 'root'})
export class ScheduleFormService {
  constructor(private formBuilder: FormBuilder) {}

  createFormGroup(): FormGroup {
    const dateRangeStart = moment().add(1, 'month').startOf('month');
    const formGroup = this.formBuilder.group({
      dateRange: [new DateRange(), Validators.required],
      numParticipants: [10, Validators.required],
      totalBudget: new NumberRange(),
      singleBudget: new NumberRange()
    });
    return formGroup;
  }
}
