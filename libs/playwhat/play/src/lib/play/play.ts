import { range, random, extend, sample, isArray } from 'lodash';
import { v4 as uuid } from 'uuid';
import { DataItem, toJSONDeep, generateID } from '@ygg/shared/infra/data-access';
import {
  BusinessHours,
  Location,
} from '@ygg/shared/omni-types/core';
import { Album } from '@ygg/shared/omni-types/core'
import { FormGroupModel, FormControlModel, FormControlType } from "@ygg/shared/ui/dynamic-form";
import { Tags, Taggable } from '@ygg/tags/core';
import { Product, ProductType } from '@ygg/shopping/core';
import { Addition } from '@ygg/resource/core';

export class Play implements DataItem, Taggable, Product {
  id: string;
  name: string;
  introduction: string;
  album: Album;
  businessHours: BusinessHours;
  minuteLength: number;
  location: Location;
  tags: Tags;
  creatorId: string;
  price: number;
  productType: ProductType = ProductType.Play;
  // products: Product[] = [];
  additions: Addition[] = [];

  get products(): Product[] {
    return this.additions;
  }

  static forge(options: any = {}): Play {
    const play = new Play();
    play.name = sample([
      '總統府遛鳥',
      '馬里雅納海溝深潛',
      '佔領釣魚台',
      '掛川花鳥園',
      '南極企鵝摔角',
      '大成王功淨灘',
      '野外踏青捉蟬',
      '獨角仙夏令營'
    ]);
    play.introduction = sample([
      '地球上提供給我們的物質財富足以滿足每個人的需求，但不足以滿足每個人的貪慾',
      '在這個世界上，你必須成為你希望看到的改變。',
      '要活就要像明天你就會死去一般活著。要學習就要好像你會永遠活著一般學習。',
      '心若改變，態度就會改變,態度改變，習慣就改變；習慣改變，人生就會改變。',
      '我覺得，當心靈發展到了某個階段的時候，我們將不再為了滿足食慾而殘殺動物。'
    ]);
    play.album = Album.forge();
    play.businessHours = BusinessHours.forge();
    play.location = Location.forge();
    play.tags = Tags.forge();
    play.price = random(0, 1000);
    play.minuteLength = random(30, 180);

    options.numAdditions = (typeof options.numAdditions === 'number') ? options.numAdditions : random(0, 5);
    play.additions = range(options.numAdditions).map(() => Addition.forge());
    return play;
  }

  constructor() {
    this.id = generateID();
    this.price = 0;
  }

  fromJSON(data: any): this {
    extend(this, data);
    if (data.album) {
      this.album = new Album().fromJSON(data.album);
    }
    if (data.businessHours) {
      this.businessHours = new BusinessHours().fromJSON(data.businessHours);
    }
    if (data.location) {
      this.location = new Location().fromJSON(data.location);
    }
    if (data.tags) {
      this.tags = Tags.fromJSON(data.tags);
    }
    return this;
  }

  toJSON(): any {
    const data = toJSONDeep(this);
    data.additions = this.additions.map(eq => eq.id);
    return data;
  }

  clone(): Play {
    const cloned = new Play().fromJSON(this.toJSON());
    cloned.additions = this.additions;
    return cloned;
  }
}
