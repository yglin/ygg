import { extend, isEmpty } from 'lodash';
import {
  generateID,
  SerializableJSON,
  toJSONDeep
} from '@ygg/shared/infra/data-access';
import { TheThing } from './the-thing';
import { Album } from '@ygg/shared/types';
import { ImageThumbnailItem } from '@ygg/shared/ui/widgets';

export const ImitationsDataPath = 'the-thing/imitations';

export class TheThingImitation implements ImageThumbnailItem, SerializableJSON {
  id: string;
  name: string;
  image: string;
  description: string;
  templateId: string;

  /** Create time */
  createAt: number;

  constructor(...args: any[]) {
    this.id = generateID();
    this.createAt = new Date().valueOf();

    let template: TheThing;
    let options: any = {};
    if (!isEmpty(args)) {
      if (args.length >= 1) {
        template = args[0];
      }
      if (args.length >= 2) {
        options = args[1];
      }
    }
    extend(this, options);
    if (template) {
      this.setTemplate(template);
    }
  }

  setTemplate(template: TheThing) {
    // console.log(template);
    if (!this.image) {
      this.image = template.resolveImage();
    }
    this.templateId = template.id;
  }

  fromJSON(data: any = {}): this {
    extend(this, data);
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
