import { SerializableJSON, toJSONDeep } from '@ygg/shared/infra/core';
import { isArray, random, range, sample } from 'lodash';
import { Image } from '../image/image';

export class Album implements SerializableJSON {
  static clone = Album.fromAlbum;

  cover: Image;
  photos: Image[];

  constructor(options: any = {}) {
    // this.cover = new Image();
    this.photos = [];
    if (typeof options === 'string') {
      const image = new Image(options);
      this.cover = image;
      this.photos = [image];
    }
    if (options.cover) {
      this.cover = new Image(options.cover);
    }
    if (isArray(options.photos)) {
      this.photos = options.photos.map(p => new Image(p));
    }
  }

  // TODO: Deprecated
  static fromAlbum(album: Album): Album {
    return new Album().fromJSON(album.toJSON());
  }

  static isAlbum(value: any): value is Album {
    return !!(value && value.cover && isArray(value.photos));
  }

  static forge(options: any = {}): Album {
    const forged = new Album();
    forged.photos = !isArray(options.photos)
      ? range(random(3, 7)).map(() => Image.forge())
      : options.photos;
    forged.cover = !!options.cover ? options.cover : sample(forged.photos);
    return forged;
  }

  clear() {
    this.cover = undefined; // = new Image();
    this.photos = [];
  }

  clone(): Album {
    return new Album().fromJSON(this.toJSON());
  }

  addPhotos(images: Image[]) {
    this.photos.push(...images);
    if (!this.cover) {
      this.cover = this.photos[0];
    }
  }

  deletePhoto(index: number) {
    this.photos.splice(index, 1);
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
