import { Purchase } from './purchase';
import { isEmpty, sum } from 'lodash';

export interface IProductIncomeRecord {
  productId: string;
  quantity: number;
  totalIncome: number;
}

export interface IIncomeRecord {
  producerId: string;
  purchases: Purchase[];
}

export class IncomeRecord {
  producerId: string;
  totalIncome = 0;
  numPurchases = 0;

  constructor(options: IIncomeRecord) {
    this.producerId = options.producerId;
    if (!isEmpty(options.purchases)) {
      this.numPurchases = options.purchases.length;
      this.totalIncome = sum(options.purchases.map(p => p.charge));
    }
  }
}
