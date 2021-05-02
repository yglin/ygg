import { extend } from 'lodash';
import { Tags } from './tags';

export class Taggable {
  [key: string]: any;
  id: string;
  tags: Tags;

  constructor() {
    this.id = '';
    this.tags = new Tags();
  }

  fromJSON(data: any): Taggable {
    if (data && data.tags) {
      extend(this, data);
      this.tags = new Tags(data.tags);
    }
    return this;
  }
}
