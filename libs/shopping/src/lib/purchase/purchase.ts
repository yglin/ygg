import * as _ from 'lodash';
import { Serializable } from '@ygg/interfaces'
import { Product } from '../product.interface';

// @dynamic
export class Purchase implements Serializable {
  product: Product;
  quantity: number;

  static sumAmount(purchases: Purchase[] = []): number {
    // return 0;
    return _.sumBy(purchases, p => p.product.price * p.quantity);
  }

  constructor(product: Product, quantity: number = 1) {
    this.product = product;
    this.quantity = quantity;
  }

  fromData(data: any = {}): this {
    _.extend(this, data);
    return this;
  }

  toData(): any {
    return JSON.parse(JSON.stringify(this));
  }
}
