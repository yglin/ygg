import { extend, isEmpty, sum } from 'lodash';
import { v4 as uuid } from 'uuid';
// import { Product, ProductType } from './product';
import { Duration } from '@ygg/shared/omni-types/core';
import {
  SerializableJSON,
  toJSONDeep,
  generateID
} from '@ygg/shared/infra/data-access';
import { TheThing, TheThingRelation } from '@ygg/the-thing/core';
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

  static purchase(thing: TheThing, quantity: number): Purchase {
    const newPurchase = new Purchase({
      productId: thing.id,
      price: thing.getCellValue(CellNamePrice),
      quantity
    });
    return newPurchase;
  }

  constructor(options: any = {}) {
    this.id = generateID();
    // this.productType = ProductType.Unknown;
    this.productId = '';
    this.price = 0;
    this.quantity = 0;
    this.fromJSON(options);
  }

  clone(): Purchase {
    return new Purchase().fromJSON(this.toJSON());
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
