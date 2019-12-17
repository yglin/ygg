import { extend, sample } from 'lodash';
import { Resource, ResourceType } from '../resource';
import {
  DataItem,
  toJSONDeep,
  generateID
} from '@ygg/shared/infra/data-access';
import { Album, Image, Location } from '@ygg/shared/types';
import { FormGroupValue } from '@ygg/shared/ui/dynamic-form';

export class Accommodation implements Resource, DataItem, FormGroupValue {
  collection = 'resources';
  id: string;
  name: string;
  links: string[];
  resourceType: ResourceType = ResourceType.Accommodation;
  introduction: string;
  album: Album;
  location: Location;

  static forge(): Accommodation {
    const accommodation = new Accommodation();
    accommodation.name = sample([
      '貓羅溪河床民宿',
      '舊殯儀館驚嚇旅社',
      '光明7號關懷體驗之家',
      '中興大操場天地為房綠草為床浪漫星空綴入夢堂',
      '中部創新五猩級大飯店附衛浴'
    ]);
    accommodation.introduction =
      '本站僅提供住宿資訊，不負責任何住宿相關的訂購與服務項目';
    accommodation.album = Album.forge({
      photos: [
        'https://live.staticflickr.com/5584/15154091472_7921fb897f_b.jpg',
        'https://www.publicdomainpictures.net/pictures/310000/nahled/haunted-house-1565058582xFM.jpg',
        'https://p2.piqsels.com/preview/1020/365/112/temple-greek-ruin-places-of-interest.jpg',
        'https://live.staticflickr.com/8735/16344178454_d00a9ca7d8_b.jpg',
        'https://live.staticflickr.com/4333/36681187684_fd5341dbec_b.jpg',
        'https://live.staticflickr.com/7394/16517583812_db233cdf21_b.jpg',
        'https://live.staticflickr.com/3132/3164668979_e123cf3f53_z.jpg'
      ].map(imgUrl => new Image(imgUrl))
    });
    accommodation.location = Location.forge();
    accommodation.links = ['https://playwhat-dev.ygg.tw'];
    return accommodation;
  }

  constructor() {
    this.id = generateID();
  }

  fromJSON(data: any): this {
    extend(this, data);
    if (data.album) {
      this.album = new Album().fromJSON(data.album);
    }
    if (data.location) {
      this.location = new Location().fromJSON(data.location);
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }

  clone(): Accommodation {
    return new Accommodation().fromJSON(this.toJSON());
  }
}
