import { sample, random, extend } from "lodash";
import { Product, ProductType } from "@ygg/shopping/core";
import { v4 as uuid } from "uuid";
import { SerializableJSON, toJSONDeep, generateID } from '@ygg/shared/infra/data-access';
import { Album } from '@ygg/shared/omni-types/core';
import { FormGroupValue } from '@ygg/shared/ui/dynamic-form';
import { AdditionEditDialogComponent } from 'libs/playwhat/play/src/lib/play/addition-edit-dialog/addition-edit-dialog.component';
import { Resource, ResourceType } from '../resource';

export class Addition implements Resource, Product, SerializableJSON, FormGroupValue {
  static collection = 'resources';

  id: string;
  name: string;
  price: number;
  stock: number;
  resourceType: ResourceType = ResourceType.Addition;
  productType: ProductType = ProductType.Addition;
  album: Album;

  static forge(): Addition {
    const addition = new Addition();
    addition.name = sample([
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
    addition.price = random(1, 50) * 10;
    addition.stock = random(10, 300);
    addition.album = Album.forge();
    return addition;
  }

  constructor() {
    this.id = generateID();
    this.price = 0;
    this.stock = 0;
  }

  clone(): Addition {
    return new Addition().fromJSON(this);
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