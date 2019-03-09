import * as _ from 'lodash';
import * as uuid from 'uuid';
import * as moment from 'moment';
import { DataItem, Product, Purchase as iPurchase } from '@ygg/interfaces'

// @dynamic
export class Purchase implements DataItem, iPurchase {
  id: string;
  createAt: Date;
  product: Product;
  quantity: number;

  static sumAmount(purchases: Purchase[] = []): number {
    // return 0;
    return _.sumBy(purchases, p => p.product.price * p.quantity);
  }

  constructor(product: Product, quantity: number = 1) {
    _.defaults(this, {
      id: uuid.v4(),
      createAt: moment().toDate()
    });
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
