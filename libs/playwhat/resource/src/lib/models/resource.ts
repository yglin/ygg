import { extend, toPlainObject } from 'lodash';
import * as uuid from "uuid";
import { DataItem, toJSONDeep, generateID } from '@ygg/shared/infra/data-access';
import { Album } from './album';

export class Resource implements DataItem {
  id: string;
  name: string;
  description: string;
  color: string;
  album: Album;
  timeLength: number;

  constructor() {
    this.id = generateID();
    this.color = getRandomColor();
  }

  fromJSON(data: any = {}): this {
    extend(this, data);
    
    this.album = new Album();
    if (data.album) {
      this.album.fromJSON(data.album);
    } 
    // Back compatibility
    this.album.fromJSON({
      cover: data.coverPhoto,
      photos: data.photos
    });
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}

// XXX For prototype
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

