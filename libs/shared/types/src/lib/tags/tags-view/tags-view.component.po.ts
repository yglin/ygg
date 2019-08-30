import { ViewPageObject } from '@ygg/shared/infra/test-utils';
import { Tags } from '../tags';

export class TagsViewComponentPageObject extends ViewPageObject<Tags> {
  selector = '.tags-view';
  selectors = {
    tagChip: '.tag-chip'
  };
  
  expectValue(tags: Tags) {
    for (const tagName of tags.getNames()) {
      this.tester.expectTextContent(`${this.getSelector('tagChip')}[tagName="${tagName}"]`, tagName);
    }
  }
}