import * as _ from 'lodash';
import * as uuid from 'uuid';
import * as moment from 'moment';
import { DataItem, toJSONDeep } from '@ygg/shared/data-access';
import { Contact } from '@ygg/shared/user';
import { Purchase } from './purchase/purchase';

export enum OrderState {
  UNKNOWN = 0,
  NEW,
  CONFIRMED,
  PAID,
  COMPLETED,
  CANCELED,
  REFUNDING,
  REFUNDED
}
export class Order implements DataItem {
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

  fromJSON(data: any = {}): this {
    _.extend(this, data);

    if (_.isArray(data.purchases)) {
      this.purchases = data.purchases.map(
        purchase => new Purchase(purchase.product, purchase.quantity)
      );
    }

    // console.log(data.paymentIds);
    if (_.isArray(data.paymentIds)) {
      this.paymentIds = new Set(data.paymentIds);
    }
    return this;
  }

  toJSON(): any {
    try {
      const data = toJSONDeep(this);
      data.paymentIds = Array.from(this.paymentIds);
      // console.log(data);
      return data;
    } catch (error) {
      console.error(error);
      return _.toPlainObject(this);
    }
  }
}
