import { isArray, range, random } from "lodash";
import { Image } from "../image/image";
import { toJSONDeep, SerializableJSON } from '@ygg/shared/infra/data-access';

export class Album implements SerializableJSON {
  cover: Image;
  photos: Image[];

  static forge(): Album {
    const forged = new Album();
    forged.cover = Image.forge();
    forged.photos = range(random(5,10)).map(() => Image.forge());
    return forged;
  }

  constructor() {
    this.cover = new Image();
    this.photos = [];
  }

  fromJSON(data: any): this {
    if (data) {
      if (data.cover) {
        this.cover = new Image().fromJSON(data.cover);
      }
      if (isArray(data.photos)) {
        this.photos = data.photos.map(photo => new Image().fromJSON(photo));
      }
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }


}