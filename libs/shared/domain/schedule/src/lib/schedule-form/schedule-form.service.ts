import {Injectable} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DataAccessService} from '@ygg/shared/data-access';
import {NumberRange} from '@ygg/shared/infrastructure/utility-types';

// import {DateRange, NumberRange} from
// '@ygg/shared/infrastructure/utility-types'; import * as moment from 'moment';
import {ScheduleForm} from './schedule-form';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ScheduleFormService {
  collection = 'schedule-forms';

  constructor(
      private formBuilder: FormBuilder,
      private dataAccessService: DataAccessService) {}

  defaultForm(): ScheduleForm {
    const form = new ScheduleForm();
    // TODO: Auto-complete some values
    return form;
  }

  createFormGroup(): FormGroup {
    const formGroup = this.formBuilder.group({
      dateRange: [null, Validators.required],
      numParticipants: [null, Validators.required],
      numElders: 0,
      numKids: 0,
      totalBudget: new NumberRange(),
      singleBudget: new NumberRange(),
      groupName: '',
      contacts: this.formBuilder.array([new FormControl()]),
      transpotation: '',
      transpotationHelp: '',
      accommodationHelp: '',
      likesDescription: ''
    });
    return formGroup;
  }

  get$(id: string): Observable<ScheduleForm> {
    return this.dataAccessService.get$(this.collection, id, ScheduleForm);
  }

  async upsert(scheduleForm: ScheduleForm) {
    return await this.dataAccessService.upsert(this.collection, scheduleForm, ScheduleForm);
  }
}
