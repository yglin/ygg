import { extend, isEmpty } from 'lodash';
import { TheThing } from './the-thing';

export class TheThingFilter {
  tags: string[] = [];
  keywordName: string = '';

  constructor(options: any = {}) {
    extend(this, options);
  }

  filter(theThings: TheThing[]): TheThing[] {
    return theThings.filter(theThing => this.test(theThing));
  }

  test(theThing: TheThing): boolean {
    if (!isEmpty(this.tags) && !theThing.tags.include(this.tags)) {
      return false;
    }
    if (!!this.keywordName && !theThing.name.includes(this.keywordName)) {
      return false;
    }
    return true;
  }
}
