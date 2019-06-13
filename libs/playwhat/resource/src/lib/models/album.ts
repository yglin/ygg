import { extend, isString, isArray, isEmpty } from 'lodash';
import { SerializableJSON } from '@ygg/shared/infra/data-access';

export class Album implements SerializableJSON {
  cover: URL;
  photos: URL[];

  fromJSON(data: any = {}): this {
    if (isString(data.cover) && data.cover) {
      this.cover = stringToURL(data.cover);
    }
    if (isArray(data.photos) && !isEmpty(data.photos)) {
      this.photos = [];
      for (const photo of data.photos) {
        const url = stringToURL(photo);
        if (url) {
          this.photos.push(url);
        }
      }
    }
    return this;
  }

  toJSON(): any {
    return {
      cover: this.cover.toString(),
      photos: this.photos.map(photo => photo.toString())
    };
  }

}

function stringToURL(s: string): URL {
  let url: URL;
  try {
    url = new URL(s);
  } catch(error) {
    console.error();
  }
  return url;
}
