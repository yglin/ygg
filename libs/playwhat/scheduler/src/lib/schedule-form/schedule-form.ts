import {extend, defaults} from 'lodash';
import * as uuid from 'uuid';
import {DataItem, toJSONDeep} from '@ygg/shared/infra/data-access';
// import {BadValueError, BadValueErrorCode} from '@ygg/shared/infra/error';
import { NumberRange, DateRange, Contact, Tags } from '@ygg/shared/types';

export class ScheduleForm implements DataItem {
  id: string;
  dateRange: DateRange;
  numParticipants: number;
  numElders: number;
  numKids: number;
  totalBudget: NumberRange;
  singleBudget: NumberRange;
  groupName: string;
  contacts: Contact[];
  transpotation: string;
  transpotationHelp: string;
  accommodationHelp: string;
  likes: Tags;
  likesDescription: string;


  static isScheduleForm(value: any): value is ScheduleForm {
    if (value && value.dateRange && value.numParticipants) {
      return true;
    } else {
      return false;
    }
  }

  constructor() {
    defaults(this, {
      id: uuid.v4()
    });
  }

  fromJSON(data: any = {}): this {
    extend(this, data);

    if (data.dateRange) {
      this.dateRange = new DateRange().fromJSON(data.dateRange);
    }
    if (data.totalBudget) {
      this.totalBudget = new NumberRange().fromJSON(data.totalBudget);
    }

    if (data.likes) {
      this.likes = new Tags().fromJSON(data.likes);
    }

    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}