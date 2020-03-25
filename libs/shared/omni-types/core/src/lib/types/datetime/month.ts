import * as moment from 'moment';
import { DateRange } from './date-range';

export class Month extends DateRange {
  static thisMonth(): Month {
    const start = moment().startOf('month');
    const end = moment().endOf('month');
    return new Month(start.toDate(), end.toDate());
  }

  /**
   * Create a month with offset from this month
   * 
   * @param offset offset from this month, 0 = this month, -1 = last month, 1 = next month
   */
  static fromMonthOffset(offset: number): Month {
    const start = moment().add(offset, 'month').startOf('month');
    const end = moment(start).endOf('month');
    return new Month(start.toDate(), end.toDate());
  }

  get name(): string {
    return moment(this.start).format('YYYYMM');
  }

  get displayName(): string {
    return moment(this.start).format('YYYY年M月');
  }
}
