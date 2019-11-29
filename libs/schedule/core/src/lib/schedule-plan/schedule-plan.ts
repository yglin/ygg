import { isEmpty, extend, defaults, sample, range, isArray } from 'lodash';
import { v4 as uuid } from 'uuid';
import { DataItem, toJSONDeep } from '@ygg/shared/infra/data-access';
// import {BadValueError, BadValueErrorCode} from '@ygg/shared/infra/error';
import { NumberRange, DateRange, Contact, DayTimeRange } from '@ygg/shared/types';
import { User } from '@ygg/shared/user';
// import { PlayTag } from '@ygg/playwhat/play';
import { Tags, Taggable } from '@ygg/tags/core';
import { TranspotationTypes } from './transpotation';
import { Purchase } from '@ygg/shopping/core';

export class SchedulePlan implements DataItem, Taggable {
  id: string;
  agentId: string;
  creatorId: string;
  dateRange: DateRange;
  dayTimeRange: DayTimeRange;
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
  tags: Tags;
  likesDescription: string;
  purchases: Purchase[];

  static isSchedulePlan(value: any): value is SchedulePlan {
    if (value && value.dateRange && value.numParticipants) {
      return true;
    } else {
      return false;
    }
  }

  static forge(extData: any = {}): SchedulePlan {
    const forged: SchedulePlan = new SchedulePlan();
    forged.dateRange = DateRange.forge();
    forged.dayTimeRange = DayTimeRange.forge();
    forged.numParticipants = Math.floor(50 + 50 * Math.random());
    forged.numElders = 1 + Math.floor(forged.numParticipants * Math.random() * 0.5);
    forged.numKids = 1 + Math.floor(forged.numParticipants * Math.random() * 0.5);
    forged.singleBudget = new NumberRange().fromJSON([
      Math.floor(0 + 500 * Math.random()),
      Math.floor(500 + 500 * Math.random())
    ]);
    forged.totalBudget = new NumberRange().fromJSON([
      forged.singleBudget.min * forged.numParticipants,
      forged.singleBudget.max * forged.numParticipants
    ]);
    forged.groupName = sample([
      '科學小飛俠',
      '武當派',
      '華山派',
      '硬梆幫',
      '危險台獨份子',
      '白蓮教',
      '五毛黨玻璃心'
    ]);
    const numContacts = Math.floor(1 + 3 * Math.random());
    forged.contacts = [];
    while (forged.contacts.length < numContacts) {
      forged.contacts.push(Contact.forge());
    }
    forged.transpotation = sample(TranspotationTypes).id;
    forged.transpotationHelp = sample([
      '我要坐空軍一號',
      '我要坐核子潛艇',
      '我要筋斗雲，不然騎神龍也可以',
      '我要蝙蝠車來載',
      '我要有電子花車隨行，當然要有辣妹鋼管舞',
      '我想騎鴕鳥'
    ]);
    forged.accommodationHelp = sample([
      '請幫我安排住宿，房間乾淨就好，最好是有養駝鳥的民宿',
      '五星級飯店的總統套房',
      '六星級飯店的皇帝套房',
      '七星級飯店的七星神龍套房',
      '八星級飯店的八格野鹿套房',
      '九星級飯店的九大行星套房'
    ]);
    forged.tags = Tags.forge();
    forged.likesDescription = sample([
      '希望有年輕漂亮的導遊，沒有的話年輕漂亮的鴕鳥也可以',
      '希望有餵草泥馬吃草的體驗',
      '希望有摸小動物摸到爽的行程，兔子或天竺鼠之類的',
      '希望有淨灘行程，海灘或是河灘',
      '希望有捉蟬或是蟋蟀的體驗',
    ]);
    extend(forged, extData);
    // forged.agentId = User.forge().id;
    return forged;
  }

  constructor() {
    this.id = uuid();
    this.purchases = [];
  }

  hasLikes(): boolean {
    return (this.tags && !this.tags.isEmpty()) || !!this.likesDescription;
  }

  hasPurchases(): boolean {
    return !isEmpty(this.purchases);
  }

  fromJSON(data: any = {}): this {
    extend(this, data);

    if (data.dateRange) {
      this.dateRange = new DateRange().fromJSON(data.dateRange);
    }
    if (data.dayTimeRange) {
      this.dayTimeRange = new DayTimeRange().fromJSON(data.dayTimeRange);
    }
    if (data.totalBudget) {
      this.totalBudget = new NumberRange().fromJSON(data.totalBudget);
    }
    if (data.singleBudget) {
      this.singleBudget = new NumberRange().fromJSON(data.singleBudget);
    }
    if (data.tags) {
      this.tags = Tags.fromJSON(data.tags);
    }
    if (!isEmpty(data.purchases)) {
      this.purchases = data.purchases.map(p => new Purchase().fromJSON(p));
    }

    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }

  clone(): SchedulePlan {
    return new SchedulePlan().fromJSON(this.toJSON());
  }
}
