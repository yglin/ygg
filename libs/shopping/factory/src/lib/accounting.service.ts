import { Injectable } from '@angular/core';
import { TheThing, TheThingFilter } from '@ygg/the-thing/core';
import { TheThingAccessService } from '@ygg/the-thing/ui';
import { Observable, of } from 'rxjs';
import {
  IncomeRecord,
  Purchase,
  RelationPurchase,
  ImitationOrder
} from '@ygg/shopping/core';
import { map, switchMap } from 'rxjs/operators';
import { isEmpty, keys } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {
  constructor(private theThingAccessService: TheThingAccessService) {}

  listIncomeRecords$(filter: TheThingFilter): Observable<IncomeRecord[]> {
    filter.addState(
      ImitationOrder.stateName,
      ImitationOrder.states.completed.value
    );
    return this.theThingAccessService.listByFilter$(filter).pipe(
      // tap(() => console.log('Get income records~!!')),
      map(orders => {
        // console.dir(orders);
        const byProductPurchases: { [productId: string]: Purchase[] } = {};
        if (!isEmpty(orders)) {
          for (const order of orders) {
            const purchaseRelations = order.getRelations(RelationPurchase.name);
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
}
