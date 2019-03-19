import { extend, defaults, toPlainObject } from 'lodash';
import { v4 as uuidV4 } from 'uuid';
import * as moment from 'moment';
import { Purchase } from './order.interface';
import { DataItem } from './data.interface';

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface RedircetInfo {
  url: string;
  method: string;
  data: any;
}

export interface PaymentLog {
  timestamp: string;
  type: string;
  data: string;
}

export class Payment implements DataItem {
  id: string;
  purchases: Purchase[];
  description: string;
  createAt: Date;
  amount: number;
  dueDate: Date;
  paidDate: Date;
  methodId: string;
  isPaid: boolean;
  logs: PaymentLog[];
  orderId: string;
  ownerId?: string;
  auditorId?: string;
  redirectInfo: RedircetInfo;

    constructor() {
    defaults(this, {
      id: uuidV4(),
      createAt: moment().toDate(),
      amount: 0,
      dueDate: moment()
        .add(1, 'week')
        .toDate(),
      methodId: 'ecpay',
      logs: [],
      isPaid: false
    });
  }

  fromData(data: any = {}): this {
    extend(this, data);
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
      return toPlainObject(this);
    }
  }

}

