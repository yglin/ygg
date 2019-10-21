import { filter } from 'lodash';
import { Injectable } from '@angular/core';
import { DataAccessService } from '@ygg/shared/infra/data-access';

// import {DateRange, NumberRange} from
// '@ygg/shared/infra/utility-types'; import * as moment from 'moment';
import { ScheduleForm } from './schedule-form';
import { Observable, of } from 'rxjs';
// import { switchMap } from 'rxjs/operators';
// import { UserService, User } from './schedule-form-list/node_modules/@ygg/shared/user';
import { Query } from '@ygg/shared/infra/data-access';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ScheduleFormService {
  collection = 'schedule-forms';

  constructor(
    private dataAccessService: DataAccessService
  ) {}

  // defaultForm(): ScheduleForm {
  //   const form = new ScheduleForm();
  //   // TODO: Auto-complete some values
  //   return form;
  // }

  validate(scheduleForm: ScheduleForm): boolean {
    return ScheduleForm.isScheduleForm(scheduleForm);
  }

  get$(id: string): Observable<ScheduleForm> {
    return this.dataAccessService.get$(this.collection, id, ScheduleForm);
  }

  find$(queries: Query | Query[]): Observable<ScheduleForm[]> {
    return this.dataAccessService
      .find$(this.collection, queries, ScheduleForm)
      .pipe(
        map(scheduleForms => filter(scheduleForms, form => this.validate(form)))
      );
  }

  async upsert(scheduleForm: ScheduleForm) {
    // await this.playTagService.upsertList(scheduleForm.tags.map(tagName => new PlayTag(tagName)));
    return await this.dataAccessService.upsert(
      this.collection,
      scheduleForm,
      ScheduleForm
    );
  }
}
