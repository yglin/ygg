import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';

@Injectable({providedIn: 'root'})
export class ScheduleFormService {
  constructor(private formBuilder: FormBuilder) {}

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      dateRange: [
        null,
        Validators.required
      ],
      numParticipants: [10, Validators.required]
    });
  }
}
