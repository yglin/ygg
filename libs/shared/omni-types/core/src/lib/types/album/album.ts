import { isArray, range, random, sample, isEmpty } from 'lodash';
import { Image } from '../image/image';
import { toJSONDeep, SerializableJSON } from '@ygg/shared/infra/data-access';

export class Album implements SerializableJSON {
  static clone = Album.fromAlbum;

  cover: Image;
  photos: Image[];

  // TODO: Deprecated
  static fromAlbum(album: Album): Album {
    return new Album().fromJSON(album.toJSON());
  }

  static isAlbum(value: any): value is Album {
    return !!(value && value.cover && isArray(value.photos));
  }

  static forge(options: any = {}): Album {
    const forged = new Album();
    forged.photos = isEmpty(options.photos)
      ? range(random(3, 10)).map(() => Image.forge())
      : options.photos;
    forged.cover = !!options.cover ? options.cover : sample(forged.photos);
    return forged;
  }

  constructor() {
    this.cover = new Image();
    this.photos = [];
  }

  clear() {
    this.cover = new Image();
    this.photos = [];
  }

  clone(): Album {
    return new Album().fromJSON(this.toJSON());
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
