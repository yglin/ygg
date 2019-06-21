import { values } from 'lodash';
import { Injectable } from '@angular/core';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { Tags } from '@ygg/shared/types';

// import {DateRange, NumberRange} from
// '@ygg/shared/infra/utility-types'; import * as moment from 'moment';
import { ScheduleForm } from './schedule-form';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService, User } from '@ygg/shared/user';

@Injectable({ providedIn: 'root' })
export class ScheduleFormService {
  collection = 'schedule-forms';

  constructor(
    private dataAccessService: DataAccessService,
    private userService: UserService
  ) {}

  // defaultForm(): ScheduleForm {
  //   const form = new ScheduleForm();
  //   // TODO: Auto-complete some values
  //   return form;
  // }

  get$(id: string): Observable<ScheduleForm> {
    return this.dataAccessService.get$(this.collection, id, ScheduleForm);
  }

  async upsert(scheduleForm: ScheduleForm) {
    return await this.dataAccessService.upsert(
      this.collection,
      scheduleForm,
      ScheduleForm
    );
  }

  listLikes$(): Observable<Tags> {
    // TODO: Fetch from real database
    const likes = new Tags(['手作DIY', '協力車', '咖啡', '押花', '生態導覽']);
    return of(likes);
  }

  listAgentUsers$(): Observable<User[]> {
    // TODO: Query from real database
    return of(values(this.userService.anonymousUsers));
  }
}
