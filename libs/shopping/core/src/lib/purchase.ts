import { extend, isEmpty, sum } from 'lodash';
import { v4 as uuid } from 'uuid';
// import { Product, ProductType } from './product';
import { Duration } from '@ygg/shared/omni-types/core';
import {
  SerializableJSON,
  toJSONDeep,
  generateID
} from '@ygg/shared/infra/data-access';
import { TheThing, TheThingRelation, TheThingCell } from '@ygg/the-thing/core';
import { CellNamePrice } from './product';

export const RelationNamePurchase = '訂購';

export const CellNameQuantity = '數量/人數';

export const CellNameCharge = '費用';

export enum PurchaseState {
  Unknown = -1,
  New,
  Confirmed,
  Complete
}

interface PurchaseOptions {
  product: TheThing;
  quantity: number;
  [key: string]: any;
}

export class Purchase implements SerializableJSON {
  id: string;
  consumerId: string;
  productId: string;
  quantity: number;
  duration: Duration;
  price: number;
  state: PurchaseState;
  childPurchaseIds: string[];

  get charge(): number {
    return this.price * this.quantity;
  }

  static isPurchase(value: any): value is Purchase {
    return !!(value && value.productId);
  }

  static purchase(
    consumer: TheThing,
    product: TheThing,
    quantity: number
  ): Purchase {
    const newPurchase = new Purchase({
      consumerId: consumer.id,
      productId: product.id,
      price: product.getCellValue(CellNamePrice),
      quantity
    });
    return newPurchase;
  }

  static fromRelation(relation: TheThingRelation): Purchase {
    const newPurchase = new Purchase({
      consumerId: relation.subjectId,
      productId: relation.objectId,
      price: relation.getCellValue(CellNamePrice),
      quantity: relation.getCellValue(CellNameQuantity)
    });
    return newPurchase;
  }

  constructor(options: any = {}) {
    this.id = generateID();
    // this.productType = ProductType.Unknown;
    this.consumerId = '';
    this.productId = '';
    this.price = 0;
    this.quantity = 0;
    this.fromJSON(options);
  }

  clone(): Purchase {
    return new Purchase().fromJSON(this.toJSON());
  }

  toRelation(): TheThingRelation {
    return new TheThingRelation({
      name: RelationNamePurchase,
      subjectId: this.consumerId,
      objectId: this.productId,
      cells: [
        new TheThingCell({
          name: CellNamePrice,
          type: 'number',
          value: this.price
        }),
        new TheThingCell({
          name: CellNameQuantity,
          type: 'number',
          value: this.quantity
        })
      ]
    });
  }

  fromJSON(data: any = {}): this {
    // console.log(data);
    extend(this, data);
    // console.log(this);
    if (data.duration) {
      this.duration = new Duration().fromJSON(data.duration);
    }
    return this;
  }

  toJSON(): any {
    const data = toJSONDeep(this);
    delete data['charge'];
    return data;
  }
}
