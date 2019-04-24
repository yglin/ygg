import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';

@Injectable({providedIn: 'root'})
export class ScheduleFormService {
  constructor(private formBuilder: FormBuilder) {}

  createFormGroup(): FormGroup {
    const dateRangeStart = moment().add(1, 'month').startOf('month');
    return this.formBuilder.group({
      dateRange: [
        {
          start: dateRangeStart.toDate(),
          end: dateRangeStart.add(1, 'week').toDate()
        },
        Validators.required
      ],
      numParticipants: [10, Validators.required]
    });
  }
}
