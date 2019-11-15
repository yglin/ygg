import { filter, isEmpty } from 'lodash';
import { Injectable } from '@angular/core';
import { DataAccessService } from '@ygg/shared/infra/data-access';

// import {DateRange, NumberRange} from
// '@ygg/shared/infra/utility-types'; import * as moment from 'moment';
import { SchedulePlan } from '@ygg/schedule/core';
import { Observable, of, from } from 'rxjs';
// import { switchMap } from 'rxjs/operators';
// import { UserService, User } from './schedule-plan-list/node_modules/@ygg/shared/user';
import { Query } from '@ygg/shared/infra/data-access';
import { map, tap, switchMap } from 'rxjs/operators';
import { Purchase } from '@ygg/shopping/core';
import { PurchaseService } from "@ygg/shopping/data-access";

@Injectable({ providedIn: 'root' })
export class SchedulePlanService {
  collection = 'schedule-plans';

  constructor(
    private dataAccessService: DataAccessService,
    private purchaseService: PurchaseService
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
    return this.dataAccessService.get$(this.collection, id).pipe(
      switchMap(item => {
        return from(this.load(item));
      })
    );
  }

  find$(queries: Query | Query[]): Observable<SchedulePlan[]> {
    return this.dataAccessService
      .find$<SchedulePlan>(this.collection, queries)
      .pipe(
        switchMap(items => {
          return from(Promise.all(items.map(item => this.load(item))))
        }),
        map(schedulePlans => filter(schedulePlans, schedulePlan => this.validate(schedulePlan)))
      );
  }

  async save(schedulePlan: SchedulePlan): Promise<any> {
    const schedulePlanData: any = schedulePlan.toJSON();
    const purchasesData: any[] = [];
    for (const purchase of schedulePlan.purchases) {
      const purchaseData = await this.purchaseService.save(purchase);
      purchasesData.push(purchaseData);
    }
    schedulePlanData.purchases = purchasesData;
    return await this.dataAccessService.upsert(
      this.collection,
      schedulePlanData
    );
  }

  async load(schedulePlanData: any): Promise<SchedulePlan> {
    const schedulePlan: SchedulePlan = new SchedulePlan().fromJSON(schedulePlanData);
    if (!isEmpty(schedulePlanData.purchase)) {
      const purchases: Purchase[] = [];
      for (const purchaseData of schedulePlanData.purchase) {
        purchases.push(await this.purchaseService.load(purchaseData));
      }
      schedulePlan.purchases = purchases;
    }
    return schedulePlan;
  }

  // async upsert(schedulePlan: SchedulePlan) {
  //   // await this.playTagService.upsertList(schedulePlan.tags.map(tagName => new PlayTag(tagName)));
  //   return await this.dataAccessService.upsert(
  //     this.collection,
  //     schedulePlan,
  //     SchedulePlan
  //   );
  // }
}
