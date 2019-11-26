import { extend, isEmpty, sum } from 'lodash';
import { v4 as uuid } from 'uuid';
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
  product: Product;
  quantity: number;
  [key: string]: any;
}

export class Purchase implements SerializableJSON {
  id: string;
  productType: ProductType;
  productId: string;
  quantity: number;
  duration: Duration;
  selfPrice: number;
  state: PurchaseState;
  children: Purchase[] = [];

  static isPurchase(value: any): value is Purchase {
    return !!(value && value.productType && value.productId);
  }

  get price(): number {
    return this.selfPrice + sum(this.children.map(child => child.price));
  }

  constructor(options?: PurchaseOptions) {
    this.id = uuid();
    if (options) {
      this.productType = options.product.productType || ProductType.Unknown;
      this.productId = options.product.id || '';
      this.quantity = options.quantity || 0;
      this.selfPrice = options.product.price * this.quantity;
      this.duration = options.duration || null;
      this.state = PurchaseState.New;

      if (!isEmpty(options.product.products)) {
        this.children = options.product.products.map(childProduct => {
          options.product = childProduct;
          return new Purchase(options);
        });
      }
    }
  }

  fromJSON(data: any = {}): this {
    extend(this, data);
    if (data.duration) {
      this.duration = new Duration().fromJSON(data.duration);
    }
    if (!isEmpty(data.children)) {
      this.children = data.children.map(child => new Purchase().fromJSON(child));
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
