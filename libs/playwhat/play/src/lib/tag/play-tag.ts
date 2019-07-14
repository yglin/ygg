import { extend, sample } from "lodash";
import { DataItem, toJSONDeep } from '@ygg/shared/infra/data-access';
import { v4 as uuid } from "uuid";

export class PlayTag implements DataItem {
  id: string;
  name: string;

  static forge(): PlayTag {
    const newOne = new PlayTag();
    newOne.name = sample([
      'HAVE',
      'YOU',
      'EVER',
      'SEE',
      'THE',
      'RAIN',
      'YYGG',
      'BIRD',
      'BIRB',
      'BORB',
      'ORB',
      '口',
      '食道',
      '胃',
      '十二指腸',
      '小腸',
      '大腸',
      '盲腸',
      '直腸',
      '肛門',
      'Cockatiel',
      'Cockatoo',
      'Eclectus',
      'Conure',
      'Parakeet',
      'Budgie',
      'Macaw'
    ]);
    return newOne;
  }

  constructor() {
    this.id = uuid();
  }

  fromJSON(data: any): this {
    extend(this, data);
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}