import { extend } from 'lodash';
import { v4 as uuid } from "uuid";
import { Product, ProductType } from './product';
import { Duration } from '@ygg/shared/types';
import { SerializableJSON, toJSONDeep } from '@ygg/shared/infra/data-access';

export enum PurchaseState {
  Unknown = -1,
  New,
  Confirmed,
  Complete
}

interface PurchaseOptions {
  productType: ProductType;
  productId: string;
  quantity: number;
  [key: string]: any;
}

export class Purchase implements SerializableJSON {
  id: string;
  productType: ProductType;
  productId: string;
  quantity: number;
  duration: Duration;
  price: number;
  state: PurchaseState;

  static isPurchase(value: any): value is Purchase {
    return !!(value && value.productType && value.productId);
  }

  constructor(options?: PurchaseOptions) {
    options = options || {
      productType: ProductType.Unknown,
      productId: '',
      quantity: 0
    };
    this.id = uuid();
    this.productType = options.productType || ProductType.Unknown;
    this.productId = options.productId || '';
    this.quantity = options.quantity || 0;
    this.price = options.price || 0;
    this.duration = options.duration || undefined;
    this.state = PurchaseState.New;
  }

  fromJSON(data: any): this {
    extend(this, data);
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
