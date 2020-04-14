import { IDataAccessor } from '@ygg/shared/infra/core';
import { Purchase, RelationAddition } from '../models';
import { TheThing } from '@ygg/the-thing/core';
import { isEmpty } from 'lodash';
import { IConsumer } from '../models/consumer';

export class PurchaseAgent {
  consumer: IConsumer;
  dataAccessor: IDataAccessor<TheThing>;

  constructor(consumer: IConsumer, dataAccessor: IDataAccessor<TheThing>) {
    this.consumer = consumer;
    this.dataAccessor = dataAccessor;
  }

  async purchaseTheThing(
    product: TheThing,
    quantity: number
  ): Promise<Purchase[]> {
    const purchases: Purchase[] = [];
    purchases.push(Purchase.purchase(this.consumer, product, quantity));
    const additions = product.getRelations(RelationAddition.name);
    if (!isEmpty(additions)) {
      for (const addition of additions) {
        const additionProduct: TheThing = await this.dataAccessor.get(
          addition.objectId
        );
        const additionPurchase: Purchase[] = await this.purchaseTheThing(
          additionProduct,
          quantity
        );
        purchases.push(...additionPurchase);
      }
    }
    return purchases;
  }
}
