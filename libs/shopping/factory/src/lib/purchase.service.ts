import { Injectable } from '@angular/core';
import { Purchase, CellNamePrice, RelationAddition } from '@ygg/shopping/core';
import { LogService } from '@ygg/shared/infra/log';
import { take } from 'rxjs/operators';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { TheThing } from '@ygg/the-thing/core';
import { castArray, isEmpty } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  purchasePool: { [purchaseId: string]: Purchase } = {};

  constructor(
    private logService: LogService,
    private theThingAccessService: TheThingAccessService
  ) {}

  async purchase(
    productIds: string | string[],
    quantity: number
  ): Promise<Purchase[]> {
    productIds = castArray(productIds);
    let purchases: Purchase[] = [];
    try {
      for (const productId of productIds) {
        const product: TheThing = await this.theThingAccessService
          .get$(productId)
          .pipe(take(1))
          .toPromise();
        const thisPurchase = new Purchase({
          productId: product.id,
          quantity,
          price: product.getCellValue(CellNamePrice)
        });
        purchases.push(thisPurchase);
        const childPurchases = await this.purchase(
          product.getRelationObjectIds(RelationAddition),
          quantity
        );
        thisPurchase.childPurchaseIds = childPurchases.map(p => p.id);
        purchases = purchases.concat(childPurchases);
      }
      for (const purchase of purchases) {
        this.purchasePool[purchase.id] = purchase;
      }
      return purchases;
    } catch (error) {
      this.logService.error(
        `Failed to purchase ${productIds}, error: ${error.message}`
      );
      return [];
    }
  }

  removePurchase(targetPurchase: Purchase): Purchase[] {
    const removedPurchases: Purchase[] = [targetPurchase];
    delete this.purchasePool[targetPurchase.id];
    if (!isEmpty(targetPurchase.childPurchaseIds)) {
      for (const childPurchaseId of targetPurchase.childPurchaseIds) {
        if (childPurchaseId in this.purchasePool) {
          removedPurchases.push(this.purchasePool[childPurchaseId]);
          delete this.purchasePool[childPurchaseId];
        }
      }
    }
    return removedPurchases;
  }
}
