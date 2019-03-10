import * as _ from 'lodash';
import * as uuid from 'uuid';
import * as moment from 'moment';
import {
  DataItem,
  Order as iOrder,
  OrderState,
  Contact
} from '@ygg/interfaces';
import { Purchase } from './purchase/purchase';

export class Order implements iOrder, DataItem {
  id: string;
  createAt: Date;
  ownerId: string;
  description: string;
  state: OrderState;
  amount: number;
  contact: Contact;
  purchases: Purchase[];
  paymentIds: Set<string>;

  constructor() {
    _.defaults(this, {
      id: uuid.v4(),
      createAt: moment().toDate(),
      amount: 0,
      state: OrderState.NEW,
      purchases: [],
      paymentIds: new Set<string>()
    });
  }

  fromData(data: any = {}): this {
    _.extend(this, data);

    if (_.isArray(data.purchases)) {
      this.purchases = data.purchases.map(
        purchase => new Purchase(purchase.product, purchase.quantity)
      );
    }

    if (_.isArray(data.paymentIds)) {
      this.paymentIds = new Set(data.paymentIds);
    }
    return this;
  }

  toData(): any {
    try {
      return JSON.parse(JSON.stringify(this));
    } catch (error) {
      console.error(error);
      return _.toPlainObject(this);
    }
  }
}
