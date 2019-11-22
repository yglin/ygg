import { sample, random, extend } from "lodash";
import { Product, ProductType } from "@ygg/shopping/core";
import { v4 as uuid } from "uuid";
import { SerializableJSON, toJSONDeep } from '@ygg/shared/infra/data-access';

export class Equipment implements Product, SerializableJSON {
  static collection = 'resources';

  id: string;
  name: string;
  price: number;
  productType: ProductType = ProductType.Equipment

  static forge(): Equipment {
    const equipment = new Equipment();
    equipment.name = sample([
      '協力車',
      '美術用具',
      '採茶裝',
      '電腦',
      '茶具',
      '球拍',
      '球棒',
      '球鞋',
      '帳篷',
      '睡袋',
      '鴕鳥'
    ]);
    equipment.price = random(1, 50) * 10;
    return equipment;
  }

  constructor() {
    this.id = uuid();
  }

  fromJSON(data: any = {}): this {
    extend(this, data);
    return this;
  }

  toJSON() {
    return toJSONDeep(this);
  }
}