import * as _ from 'lodash';
import { Html } from '@ygg/shared/omni-types/core';
import { SerializableJSON, Entity } from '@ygg/shared/infra/core';
import { extend } from 'lodash';

export class Comment implements Entity {
  static collection = 'comments';

  get id(): string {
    return `${this.subjectId}_${this.ownerId}_${this.createAt.valueOf()}`;
  }

  subjectId: string;
  ownerId: string;
  content: Html;
  createAt: Date;

  constructor(options: { subjectId: string; ownerId: string; content?: Html }) {
    this.createAt = new Date();
    extend(this, options);
  }
}
