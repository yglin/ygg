import { extend } from "lodash";
import * as Moment from 'moment';
import { extendMoment, DateRange } from 'moment-range';
const moment = extendMoment(Moment);
import { DataItem } from '@ygg/shared/data-access';

export class ScheduleForm implements DataItem {
  id: string;
  dateRange: DateRange;
  numParticipants: number;
  resourceIds: string[];

  static isScheduleForm(value: any): value is ScheduleForm {
    const form = value as ScheduleForm;
    return form && form.dateRange && form.numParticipants >= 0;
  }

  fromData(data: any = {}): this {
    extend(this, data);
    if (data.dateRange && data.dateRange.start && data.dateRange.end) {
      this.dateRange = moment.range(data.dateRange.start, data.dateRange.end);
    }    
    return this;
  }

  toData(): any {
    return JSON.parse(JSON.stringify(this));
  }
}