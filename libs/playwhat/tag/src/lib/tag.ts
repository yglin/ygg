import { sample } from 'lodash';
import { DataItem } from '@ygg/shared/infra/data-access';

export class Tag implements DataItem {
  readonly id: string;
  readonly name: string;

  constructor(arg1: string | Tag) {
    if (!arg1) {
      throw new Error(`Invalid tag name for Tag constructor: ${arg1}`);
    }
    if (typeof arg1 === 'string') {
      this.name = arg1;
    } else if (Tag.isTag(arg1)) {
      this.name = arg1.name;
    }
    this.id = this.name.toLocaleLowerCase().normalize();
  }

  static fromJSON(data: any): Tag {
    return new Tag(data);
  }

  static isTag(value: any): value is Tag {
    return !!(value && typeof value.name === 'string' && value.name);
  }

  static toName(value: Tag | string): string {
    if (Tag.isTag(value)) {
      return value.name;
    } else {
      return value;
    }
  }

  static forge(): Tag {
    const name = sample([
      'HAVE',
      'YOU',
      'EVER',
      'SEE',
      'THE',
      'RAIN',
      'YYGG',
      'BIRD',
      'BIRB',
      'BORB',
      'ORB',
      'Cockatiel',
      'Cockatoo',
      'Eclectus',
      'Conure',
      'Parakeet',
      'Budgie',
      'Macaw',
      'Lovebird',
      'Caique',
      'Amazon'
    ]);
    return new Tag(name);
  }

  fromJSON(data: any = {}): this {
    throw new Error(`Deprecated, use Tag.fromJSON() instead`);
  }

  toJSON(): any {
    return {
      id: this.id,
      name: this.name
    };
  }
}