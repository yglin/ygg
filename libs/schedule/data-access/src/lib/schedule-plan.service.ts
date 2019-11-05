import { filter } from 'lodash';
import { Injectable } from '@angular/core';
import { DataAccessService } from '@ygg/shared/infra/data-access';

// import {DateRange, NumberRange} from
// '@ygg/shared/infra/utility-types'; import * as moment from 'moment';
import { SchedulePlan } from '@ygg/schedule/core';
import { Observable, of } from 'rxjs';
// import { switchMap } from 'rxjs/operators';
// import { UserService, User } from './schedule-plan-list/node_modules/@ygg/shared/user';
import { Query } from '@ygg/shared/infra/data-access';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SchedulePlanService {
  collection = 'schedule-plans';

  constructor(
    private dataAccessService: DataAccessService
  ) {}

  // defaultForm(): SchedulePlan {
  //   const form = new SchedulePlan();
  //   // TODO: Auto-complete some values
  //   return form;
  // }

  validate(schedulePlan: SchedulePlan): boolean {
    return SchedulePlan.isSchedulePlan(schedulePlan);
  }

  get$(id: string): Observable<SchedulePlan> {
    return this.dataAccessService.get$(this.collection, id, SchedulePlan);
  }

  find$(queries: Query | Query[]): Observable<SchedulePlan[]> {
    return this.dataAccessService
      .find$(this.collection, queries, SchedulePlan)
      .pipe(
        map(schedulePlans => filter(schedulePlans, schedulePlan => this.validate(schedulePlan)))
      );
  }

  async upsert(schedulePlan: SchedulePlan) {
    // await this.playTagService.upsertList(schedulePlan.tags.map(tagName => new PlayTag(tagName)));
    return await this.dataAccessService.upsert(
      this.collection,
      schedulePlan,
      SchedulePlan
    );
  }
}
