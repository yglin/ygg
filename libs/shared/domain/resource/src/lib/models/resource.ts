import { extend, isArray } from 'lodash';
import * as uuid from "uuid";
import { DataItem } from '@ygg/shared/data-access';
import { Album } from './album';

export class Resource implements DataItem {
  id: string;
  name: string;
  color: string;
  album: Album;

  constructor() {
    this.id = uuid.v4();
    this.color = getRandomColor();
  }

  fromData(data: any = {}): this {
    extend(this, data);
    
    this.album = new Album();
    if (data.album) {
      this.album.fromData(data.album);
    } 
    // Back compatibility
    this.album.fromData({
      cover: data.coverPhoto,
      photos: data.photos
    });
    return this;
  }

  toData(): any {
    return JSON.parse(JSON.stringify(this));
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

