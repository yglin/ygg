import { extend, defaults, sample, range, isArray } from 'lodash';
import * as uuid from 'uuid';
import { DataItem, toJSONDeep } from '@ygg/shared/infra/data-access';
// import {BadValueError, BadValueErrorCode} from '@ygg/shared/infra/error';
import { NumberRange, DateRange, Contact } from '@ygg/shared/types';
import { User } from '@ygg/shared/user';
// import { PlayTag } from '@ygg/playwhat/play';
import { Tags, Taggable } from '@ygg/tags/core';
import { TranspotationTypes } from './transpotation';

export class ScheduleForm implements DataItem, Taggable {
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
  tags: Tags;
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
    forged.numElders = 1 + Math.floor(forged.numParticipants * Math.random() * 0.5);
    forged.numKids = 1 + Math.floor(forged.numParticipants * Math.random() * 0.5);
    forged.totalBudget = new NumberRange().fromJSON([
      Math.floor(0 + 5000 * Math.random()),
      Math.floor(5000 + 5000 * Math.random())
    ]);
    forged.singleBudget = new NumberRange().fromJSON([
      Math.floor(0 + 500 * Math.random()),
      Math.floor(500 + 500 * Math.random())
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
    // forged.agentId = User.forge().id;
    return forged;
  }

  constructor() {
    defaults(this, {
      id: uuid.v4()
    });
  }

  hasLikes(): boolean {
    return (this.tags && !this.tags.isEmpty()) || !!this.likesDescription;
  }

  fromJSON(data: any = {}): this {
    extend(this, data);

    if (data.dateRange) {
      this.dateRange = new DateRange().fromJSON(data.dateRange);
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

    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }

  clone(): ScheduleForm {
    return new ScheduleForm().fromJSON(this.toJSON());
  }
}
