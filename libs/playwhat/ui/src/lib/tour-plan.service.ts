import { Injectable } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { Observable, combineLatest, of } from 'rxjs';
import {
  ImitationTourPlan,
  CellNames as TourPlanCellNames,
  States as TourPlanStates
} from '@ygg/playwhat/core';
import { ApplicationService } from './application.service';
import {
  IncomeRecord,
  Purchase,
  RelationNamePurchase
} from '@ygg/shopping/core';
import { DateRange } from '@ygg/shared/omni-types/core';
import { map, switchMap, tap } from 'rxjs/operators';
import { isEmpty, values, keys } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class TourPlanService {
  constructor(
    private applicationService: ApplicationService,
    private theThingAccessService: TheThingAccessService
  ) {}

  listInApplication$(): Observable<TheThing[]> {
    const filter = ImitationTourPlan.filter.clone();
    return this.applicationService.listInApplication$(filter);
  }

  listIncomeRecords$(dateRange: DateRange): Observable<IncomeRecord[]> {
    return this.listCompleted$(dateRange).pipe(
      // tap(() => console.log('Get income records~!!')),
      map(tourPlans => {
        // console.dir(tourPlans);
        const byProductPurchases: { [productId: string]: Purchase[] } = {};
        if (!isEmpty(tourPlans)) {
          for (const tourPlan of tourPlans) {
            const purchaseRelations = tourPlan.getRelations(
              RelationNamePurchase
            );
            for (const pr of purchaseRelations) {
              if (!(pr.objectId in byProductPurchases)) {
                byProductPurchases[pr.objectId] = [];
              }
              byProductPurchases[pr.objectId].push(Purchase.fromRelation(pr));
            }
          }
        }
        return byProductPurchases;
      }),
      switchMap((byProductPurchases: { [productId: string]: Purchase[] }) => {
        // console.dir(byProductPurchases);
        const byProducerPurchases: { [producerId: string]: Purchase[] } = {};

        if (isEmpty(byProductPurchases)) {
          return of(byProducerPurchases);
        } else {
          return this.theThingAccessService
            .listByIds$(keys(byProductPurchases))
            .pipe(
              map((products: TheThing[]) => {
                for (const product of products) {
                  // console.log(` Product owner ${product.ownerId}`);
                  if (!(product.ownerId in byProducerPurchases)) {
                    byProducerPurchases[product.ownerId] = [];
                  }
                  byProducerPurchases[product.ownerId].push(
                    ...byProductPurchases[product.id]
                  );
                }
                return byProducerPurchases;
              })
            );
        }
      }),
      map((byProducerPurchases: { [producerId: string]: Purchase[] }) => {
        // console.dir(byProducerPurchases);
        const incomeRecords: IncomeRecord[] = [];
        for (const producerId in byProducerPurchases) {
          if (byProducerPurchases.hasOwnProperty(producerId)) {
            const purchases = byProducerPurchases[producerId];
            incomeRecords.push(
              new IncomeRecord({
                producerId,
                purchases
              })
            );
          }
        }
        // console.dir(incomeRecords);
        return incomeRecords;
      })
    );
  }

  listCompleted$(dateRange: DateRange): Observable<TheThing[]> {
    const filter = ImitationTourPlan.filter.clone();
    const flags = {};
    flags[TourPlanStates.Completed] = true;
    filter.addFlags(flags);
    return this.theThingAccessService.listByFilter$(filter);
  }

  async complete(tourPlan: TheThing) {
    tourPlan.setFlag(TourPlanStates.Completed, true);
    tourPlan.addCell(
      ImitationTourPlan.createCell(
        TourPlanCellNames.completeAt,
        new Date().valueOf()
      )
    );
    return this.theThingAccessService.upsert(tourPlan);
  }
}
