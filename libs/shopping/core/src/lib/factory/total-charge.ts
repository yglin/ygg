import { TheThingRelation } from '@ygg/the-thing/core';
import { isEmpty, sum } from 'lodash';
import { CellNames, Purchase } from '../models';

export async function evalTotalChargeFromRelations(
  purchaseRelations: TheThingRelation[]
): Promise<number> {
  // console.log(`evalTotalChargeFromRelations`);
  // console.log(purchaseRelations);
  const totalCharge = isEmpty(purchaseRelations)
    ? 0
    : sum(
        purchaseRelations.map(
          pr =>
            pr.getCellValue(CellNames.price) *
            pr.getCellValue(CellNames.quantity)
        )
      );
  // console.log(totalCharge);
  return totalCharge;
}

export async function evalTotalChargeFromPurchases(
  purchases: Purchase[]
): Promise<number> {
  let totalCharge = 0;
  for (const purchase of purchases) {
    totalCharge += purchase.charge;
  }
  return totalCharge;
}
