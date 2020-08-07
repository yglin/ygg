import { Injectable } from '@angular/core';
import { Purchase, CellNames, RelationAddition } from '@ygg/shopping/core';
import { TheThingAccessService } from '@ygg/the-thing/ui';
import { TheThing } from '@ygg/the-thing/core';
import { castArray, isEmpty, flatten, pick, values } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  purchasePool: { [purchaseId: string]: Purchase } = {};
  additionalPurchaseRelations: string[] = [RelationAddition.name];

  constructor(private theThingAccessService: TheThingAccessService) {}

  registerAdditionalPurchaseRelations(relationNames: string[]) {
    for (const relationName of relationNames) {
      if (this.additionalPurchaseRelations.indexOf(relationName) < 0) {
        this.additionalPurchaseRelations.push(relationName);
      }
    }
  }

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
      price: product.getCellValue(CellNames.price),
      maximum: product.getCellValue(CellNames.maximum),
      minimum: product.getCellValue(CellNames.minimum)
    });
    purchases.push(mainPurchase);
    for (const relationName of this.additionalPurchaseRelations) {
      const additionalPurchases: Purchase[] = [];
      if (product.hasRelation(relationName)) {
        for (const relation of product.getRelations(relationName)) {
          const additionProduct: TheThing = await this.theThingAccessService.load(
            relation.objectId
          );
          const followedPurchases = await this.purchase(
            additionProduct,
            options
          );
          additionalPurchases.push(...followedPurchases);
        }
      }
      purchases.push(...additionalPurchases);
    }
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
