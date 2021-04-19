import { TagsControlPageObjectCypress } from '@ygg/shared/tags/test';
import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class TreasureMapPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.treasure-map',
    'tags-input': '.tags-search .tags input'
  };

  tagsControlPO: TagsControlPageObjectCypress;

  constructor(parentSelector: string = '') {
    super(parentSelector);
    this.tagsControlPO = new TagsControlPageObjectCypress(this.getSelector());
  }
}
