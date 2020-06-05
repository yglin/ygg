import { extend } from 'lodash';
import { TheThingImitation } from './imitation';

export class Relationship {
  name: string;
  imitation: TheThingImitation;

  constructor(options: { name: string; imitation: TheThingImitation }) {
    extend(this, options);
  }
}
