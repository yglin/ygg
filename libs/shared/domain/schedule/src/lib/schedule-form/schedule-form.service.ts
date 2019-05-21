import {Injectable} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DataAccessService} from '@ygg/shared/data-access';
import {NumberRange, Tags} from '@ygg/shared/infrastructure/utility-types';

// import {DateRange, NumberRange} from
// '@ygg/shared/infrastructure/utility-types'; import * as moment from 'moment';
import {ScheduleForm} from './schedule-form';
import { Observable, of } from 'rxjs';

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
      totalBudget: null,
      singleBudget: null,
      groupName: '',
      contacts: this.formBuilder.array([new FormControl()]),
      transpotation: '',
      transpotationHelp: '',
      accommodationHelp: '',
      likes: new Tags([]),
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

  listLikes$(): Observable<Tags> {
    // TODO: Fetch from database
    const likes = new Tags([
      '手作DIY',
      '協力車',
      '咖啡',
      '押花',
      '生態導覽'
    ]);
    return of(likes);
  }
}
