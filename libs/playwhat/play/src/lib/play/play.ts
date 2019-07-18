import { extend, sample } from "lodash";
import { v4 as uuid } from "uuid";
import { DataItem, toJSONDeep } from '@ygg/shared/infra/data-access';

export class Play implements DataItem {
  id: string;
  name: string;

  static forge(): Play {
    const newOne = new Play();
    newOne.name = sample(['總統府遛鳥', '馬里雅納海溝深潛', '佔領釣魚台', '掛川花鳥園', '南極企鵝摔角', '大成王功淨灘', '野外踏青捉蟬', '獨角仙夏令營']);
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
    const data = toJSONDeep(this);
    return data;
  }

}