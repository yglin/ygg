import { extend } from 'lodash';

export class UserBoxRelation {
  static collection = 'user-boxes';

  userId: string;
  boxId: string;
  role: string;

  constructor(options: any = {}) {
    extend(this, options);
  }
}
