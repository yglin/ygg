import * as _ from 'lodash';
import * as uuid from 'uuid';
import * as moment from 'moment';
import { DataItem, toJSONDeep } from '@ygg/shared/data-access';
import { Product } from './product';

// @dynamic
export class Purchase implements DataItem {
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

  fromJSON(data: any = {}): this {
    _.extend(this, data);
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
