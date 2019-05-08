import {extend, defaults} from 'lodash';
import * as uuid from 'uuid';
import {DataItem} from '@ygg/shared/data-access';
// import {BadValueError, BadValueErrorCode} from '@ygg/shared/infrastructure/error';
import { NumberRange, DateRange, Contact } from '@ygg/shared/infrastructure/utility-types';

export class ScheduleForm implements DataItem {
  id: string;
  dateRange: DateRange;
  numParticipants: number;
  totalBudget: NumberRange;
  singleBudget: NumberRange;
  groupName: string;
  contacts: Contact[];
  resourceIds: string[];

  static isScheduleForm(value: any): value is ScheduleForm {
    if (value && value.dateRange && value.numParticipants) {
      return true;
    } else {
      return false;
    }
  }

  constructor(data: any = {}) {
    this.fromData(data);
    defaults(this, {
      id: uuid.v4()
    });
  }

  fromData(data: any = {}): this {
    extend(this, data);

    if (data.dateRange) {
      this.dateRange = new DateRange(data.dateRange);
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