import {extend} from 'lodash';
import * as Moment from 'moment';
import {DateRange, extendMoment} from 'moment-range';
const moment = extendMoment(Moment);
import {DataItem} from '@ygg/shared/data-access';
// import {BadValueError, BadValueErrorCode} from '@ygg/shared/infrastructure/error';
import { NumberRange } from '@ygg/shared/infrastructure/utility-types';

export class ScheduleForm implements DataItem {
  id: string;
  dateRange: DateRange;
  numParticipants: number;
  totalBudget: NumberRange;
  singleBudget: NumberRange;
  resourceIds: string[];

  static isScheduleForm(value: any): value is ScheduleForm {
    if (value && value.dateRange && value.numParticipants) {
      return true;
    } else {
      return false;
    }
  }

  fromData(data: any = {}): this {
    extend(this, data);
    if (data.dateRange && data.dateRange.start && data.dateRange.end) {
      this.dateRange = moment.range(data.dateRange.start, data.dateRange.end);
    }
    if (data.totalBudget) {
      this.totalBudget = new NumberRange(data.totalBudget);
    }
    return this;
  }

  toData(): any {
    return JSON.parse(JSON.stringify(this));
  }
}