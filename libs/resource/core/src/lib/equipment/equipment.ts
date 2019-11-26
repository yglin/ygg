import { sample, random, extend } from "lodash";
import { Product, ProductType } from "@ygg/shopping/core";
import { v4 as uuid } from "uuid";
import { SerializableJSON, toJSONDeep } from '@ygg/shared/infra/data-access';
import { Album } from '@ygg/shared/types';
import { FormGroupValue } from '@ygg/shared/ui/dynamic-form';
import { EquipmentEditDialogComponent } from 'libs/playwhat/play/src/lib/play/equipment-edit-dialog/equipment-edit-dialog.component';

export class Equipment implements Product, SerializableJSON, FormGroupValue {
  static collection = 'resources';

  id: string;
  name: string;
  price: number;
  stock: number;
  productType: ProductType = ProductType.Equipment;
  album: Album;

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
    equipment.stock = random(10, 300);
    equipment.album = Album.forge();
    return equipment;
  }

  constructor() {
    this.id = uuid();
    this.price = 0;
    this.stock = 0;
  }

  clone(): Equipment {
    return new Equipment().fromJSON(this);
  }

  fromJSON(data: any = {}): this {
    extend(this, data);
    if (data.album) {
      this.album = new Album().fromJSON(data.album);
    }
    return this;
  }

  toJSON() {
    return toJSONDeep(this);
  }
}