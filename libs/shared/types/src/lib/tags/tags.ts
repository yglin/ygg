import { isArray, sample, find, remove } from 'lodash';

export class Tag {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  static isTag(value: any): value is Tag {
    return !!(value && value.name);
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
}

// export class TagsSet extends Array<Tag> {

//   static forge(length: number = 10): TagsSet {
//     const forged = new TagsSet();
//     while (forged.length < length) {
//       forged.push(Tag.forge());
//     }
//     return forged;
//   }

//   constructor(tags?: Array<Tag>) {
//     super(...tags);
//     if (isArray(tags)) {
//       this.push.apply(this, tags);
//     }
//   }

//   has(tag: Tag | string): boolean {
//     let name: string;
//     if (Tag.isTag(tag)) {
//       name = tag.name;      
//     } else {
//       name = tag;
//     }
//     return !!find(this, _tag => _tag.name === name);
//   }

//   push(...tags: Tag[]): number {
//     for (const tag of tags) {
//       if (!this.has(tag)) {
//         super.push(tag);
//       }
//     }
//     return this.length;
//   }

//   add(name: string) {
//     this.push(new Tag(name));
//   }

//   delete(name: string) {
//     remove(this, _tag => _tag.name === name);
//   }
// }