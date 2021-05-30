import { HtmlViewPageObjectCypress } from '@ygg/shared/omni-types/test';
import { Post } from '@ygg/shared/post/core';
import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class PostViewPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.post-view',
    contentView: '.content-view'
  };

  contentViewPO: HtmlViewPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.contentViewPO = new HtmlViewPageObjectCypress(
      this.getSelector('contentView')
    );
  }

  expectValue(post: Post): void {
    this.contentViewPO.expectValue(post.content);
  }
}
