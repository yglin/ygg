import * as _ from 'lodash';
import * as moment from 'moment';
import * as uuid from 'uuid';
import { DataItem, Payment as iPayment } from '@ygg/interfaces';

export class PaymentLog {
  timestamp: string;
  type: string;
  data: string;
}

export class Payment implements DataItem, iPayment {
  id: string;
  ownerId: string;
  description: string;
  createAt: Date;
  amount: number;
  dueDate: Date;
  paidDate: Date;
  methodId: string;
  isPaid: boolean;
  logs: PaymentLog[];
  orderId: string;
  auditorId: string;

  constructor() {
    _.defaults(this, {
      id: uuid.v4(),
      createAt: moment().toDate(),
      amount: 0,
      dueDate: moment().add(1, 'week').toDate(),
      methodId: 'ecpay',
      logs: [],
      isPaid: false,
    });
  }

  fromData(data: any = {}): this {
    _.extend(this, data);
    if (typeof data.createAt === 'string') {
      this.createAt = new Date(data.createAt);
    }
    if (typeof data.dueDate === 'string') {
      this.createAt = new Date(data.dueDate);
    }
    if (typeof data.paidDate === 'string') {
      this.createAt = new Date(data.paidDate);
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
