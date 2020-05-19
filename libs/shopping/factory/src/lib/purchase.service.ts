import { Injectable } from '@angular/core';
import {
  Purchase,
  CellNamePrice,
  RelationAddition,
  CellNames
} from '@ygg/shopping/core';
import { LogService } from '@ygg/shared/infra/log';
import { take } from 'rxjs/operators';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { TheThing } from '@ygg/the-thing/core';
import { castArray, isEmpty, flatten, pick, values } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  purchasePool: { [purchaseId: string]: Purchase } = {};

  constructor(private theThingAccessService: TheThingAccessService) {}

  listDescendantsIncludeMe(purchases: Purchase | Purchase[]): Purchase[] {
    purchases = castArray(purchases);
    const results = [];
    for (const purchase of purchases) {
      results.push(purchase);
      if (!isEmpty(purchase.childPurchaseIds)) {
        const descendants = this.listDescendantsIncludeMe(
          values(pick(this.purchasePool, purchase.childPurchaseIds))
        );
        results.push(...descendants);
      }
    }
    return results;
  }

  async purchase(
    product: TheThing,
    options: { quantity: number } = { quantity: 1 }
  ): Promise<Purchase[]> {
    const purchases: Purchase[] = [];
    // console.dir(product);
    const mainPurchase: Purchase = new Purchase({
      productId: product.id,
      quantity: options.quantity,
      price: product.getCellValue(CellNames.price)
    });
    purchases.push(mainPurchase);
    const additionalPurchases: Purchase[] = [];
    if (product.hasRelation(RelationAddition.name)) {
      for (const relation of product.getRelations(RelationAddition.name)) {
        const additionProduct: TheThing = await this.theThingAccessService.get(
          relation.objectId
        );
        const followedPurchases = await this.purchase(additionProduct, options);
        additionalPurchases.push(...followedPurchases);
      }
    }
    purchases.push(...additionalPurchases);
    return purchases;
  }

  // Deprected
  // async purchase(
  //   consumer: string | TheThing,
  //   product: string | TheThing,
  //   quantity: number
  // ): Promise<Purchase> {
  //   if (typeof consumer === 'string') {
  //     consumer = await this.theThingAccessService
  //       .get$(consumer)
  //       .pipe(take(1))
  //       .toPromise();
  //   }
  //   if (typeof product === 'string') {
  //     product = await this.theThingAccessService
  //       .get$(product)
  //       .pipe(take(1))
  //       .toPromise();
  //   }
  //   try {
  //     const thisPurchase = Purchase.purchase(consumer, product, quantity);
  //     this.purchasePool[thisPurchase.id] = thisPurchase;
  //     if (product.hasRelation(RelationAddition.name)) {
  //       const childPurchases = await Promise.all(
  //         product
  //           .getRelationObjectIds(RelationAddition.name)
  //           .map(additionId => this.purchase(consumer, additionId, quantity))
  //       );
  //       thisPurchase.childPurchaseIds = childPurchases.map(p => p.id);
  //     }
  //     return thisPurchase;
  //   } catch (error) {
  //     console.error(
  //       `Failed to purchase ${product.id}, error: ${error.message}`
  //     );
  //     throw error;
  //   }
  // }

  removePurchases(targetPurchases: Purchase | Purchase[]): Purchase[] {
    targetPurchases = castArray(targetPurchases);
    const removedPurchases: Purchase[] = [];
    for (const targetPurchase of targetPurchases) {
      delete this.purchasePool[targetPurchase.id];
      removedPurchases.push(targetPurchase);
      if (!isEmpty(targetPurchase.childPurchaseIds)) {
        const removedChildPurchases = this.removePurchases(
          values(pick(this.purchasePool, targetPurchase.childPurchaseIds))
        );
        removedPurchases.push(...removedChildPurchases);
      }
    }
    return removedPurchases;
  }
}
