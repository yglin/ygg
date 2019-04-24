import { extend, isString, isArray, isEmpty } from 'lodash';
import { Serializable } from '@ygg/shared/data-access';

export class Album implements Serializable {
  cover: URL;
  photos: URL[];

  fromData(data: any = {}): this {
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

  toData(): any {
    return JSON.parse(JSON.stringify(this));
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
