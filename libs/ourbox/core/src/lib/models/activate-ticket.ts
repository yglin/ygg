import { URL } from 'url';
import {
  SerializableJSON,
  generateID,
  toJSONDeep
} from '@ygg/shared/infra/data-access';
import { extend } from 'lodash';

export class ActivateTicket implements SerializableJSON {
  static routePath = 'activate';
  static collection = 'activate-tickets';

  id: string;
  subjectCollection: string;
  subjectId: string;
  expireDate: Date;

  constructor(options?: {
    mail: string;
    subjectCollection: string;
    subjectId: string;
  }) {
    this.id = generateID();
    extend(this, options);
  }

  createLink() {
    return `${location.origin}/${ActivateTicket.routePath}/${this.id}`;
  }

  fromJSON(data: any): this {
    extend(this, data);
    if (data.expireDate) {
      this.expireDate = new Date(data.expireDate);
    }
    return this;
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
