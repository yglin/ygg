import {extend, defaults, sample} from 'lodash';
import * as uuid from 'uuid';
import {DataItem, toJSONDeep} from '@ygg/shared/infra/data-access';
// import {BadValueError, BadValueErrorCode} from '@ygg/shared/infra/error';
import { NumberRange, DateRange, Contact, Tags } from '@ygg/shared/types';
import { User } from '@ygg/shared/user';

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
  agentId: string;
  creatorId: string;

  static isScheduleForm(value: any): value is ScheduleForm {
    if (value && value.dateRange && value.numParticipants) {
      return true;
    } else {
      return false;
    }
  }

  static forge(): ScheduleForm {
    const forged: ScheduleForm = new ScheduleForm();
    forged.dateRange = DateRange.forge();
    forged.numParticipants = Math.floor(50 + 50 * Math.random());
    forged.numElders = Math.floor(forged.numParticipants * Math.random());
    forged.numKids = Math.floor(forged.numParticipants * Math.random());
    forged.totalBudget = new NumberRange().fromJSON([0, Math.floor(5000 + 5000 * Math.random())]);
    forged.singleBudget = new NumberRange().fromJSON([0, Math.floor(500 + 500 * Math.random())]);
    forged.groupName = sample(['科學小飛俠', '武當派', '華山派', '硬梆幫', '危險台獨份子', '白蓮教']);
    const numContacts = Math.floor(1 + 4 * Math.random());
    forged.contacts = [];
    while (forged.contacts.length < numContacts) {
      forged.contacts.push(Contact.forge());
    }
    forged.transpotation = sample(['步行', '鴕鳥', '開車', '歐托拜', '遊覽車', '直升機', '空軍一號', '鋼鐵人']);
    forged.transpotationHelp = '我想騎鴕鳥...';
    forged.accommodationHelp = '請幫我安排住宿，房間乾淨就好，最好是有養駝鳥的民宿';
    forged.likes = Tags.forge();
    forged.likesDescription = '希望有年輕漂亮的導遊，沒有的話鴕鳥也可以';
    forged.agentId = User.forge().id;
    return forged;
  }

  constructor() {
    defaults(this, {
      id: uuid.v4()
    });
  }

  hasLikes(): boolean {
    return (this.likes && this.likes.length > 0) || !!(this.likesDescription);
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