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
  unitPrice: number;
  state: PurchaseState;
  children: Purchase[] = [];

  static isPurchase(value: any): value is Purchase {
    return !!(value && value.productType && value.productId);
  }

  get totalPrice(): number {
    return (
      this.unitPrice * this.quantity +
      sum(this.children.map(child => child.totalPrice))
    );
  }

  constructor(options?: PurchaseOptions) {
    this.id = uuid();
    this.productType = ProductType.Unknown;
    this.productId = '';
    this.quantity = 0;
    if (options) {
      this.productType = options.product.productType || ProductType.Unknown;
      this.productId = options.product.id || '';
      this.quantity = options.quantity || 0;
      this.unitPrice = options.product.price;
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
    if (!isEmpty(data.children)) {
      this.children = data.children.map(child =>
        new Purchase().fromJSON(child)
      );
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
