import { extend, isEmpty, sum } from 'lodash';
import { v4 as uuid } from 'uuid';
// import { Product, ProductType } from './product';
import { Duration } from '@ygg/shared/omni-types/core';
import {
  SerializableJSON,
  toJSONDeep,
  generateID
} from '@ygg/shared/infra/core';
import {
  TheThing,
  TheThingRelation,
  TheThingCell,
  RelationDefine
} from '@ygg/the-thing/core';
// import { IDataAccessor } from '@ygg/shared/infra/core';
import { RelationAddition } from './addition';
import { IConsumer } from './consumer';
import { ShoppingCellDefines } from './cell-defines';

export const RelationPurchase = new RelationDefine({
  name: '訂購'
});

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
  maximum: number;
  minimum: number;
  childPurchaseIds: string[];

  get charge(): number {
    return this.price * this.quantity;
  }

  static isPurchase(value: any): value is Purchase {
    return !!(value && value.productId);
  }

  static purchase(
    consumer: IConsumer,
    product: TheThing,
    quantity: number
  ): Purchase {
    const newPurchase = new Purchase({
      consumerId: consumer.id,
      productId: product.id,
      price: product.getCellValue(ShoppingCellDefines.price.id),
      quantity
    });
    return newPurchase;
  }

  static fromRelation(relation: TheThingRelation): Purchase {
    const newPurchase = new Purchase({
      consumerId: relation.subjectId,
      productId: relation.objectId,
      price: relation.getCellValue(ShoppingCellDefines.price.id),
      quantity: relation.getCellValue(ShoppingCellDefines.quantity.id)
    });
    return newPurchase;
  }

  constructor(
    options: {
      consumerId?: string;
      productId?: string;
      price?: number;
      quantity?: number;
      maximum?: number;
      minimum?: number;
    } = {}
  ) {
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
      name: RelationPurchase.name,
      subjectId: this.consumerId,
      objectId: this.productId,
      cells: [
        ShoppingCellDefines.price.createCell(this.price),
        ShoppingCellDefines.quantity.createCell(this.quantity)
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
