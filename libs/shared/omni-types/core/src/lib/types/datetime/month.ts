import * as moment from 'moment';
// import { DateRange } from './date-range';
import { TimeRange } from './time-range';

export class Month extends TimeRange {
  static thisMonth(): Month {
    return Month.fromMoment(moment());
  }

  /**
   * Create a month with offset from this month
   *
   * @param offset offset from this month, 0 = this month, -1 = last month, 1 = next month
   */
  static fromMonthOffset(offset: number): Month {
    return Month.fromMoment(moment().add(offset, 'month'));
  }

  static fromMoment(mmt: moment.Moment): Month {
    const start = moment(mmt).startOf('month');
    const end = moment(mmt).endOf('month');
    return new Month(start.toDate(), end.toDate());
  }

  get name(): string {
    return moment(this.start).format('YYYYMM');
  }

  get displayName(): string {
    return moment(this.start).format('YYYY年M月');
  }
}
