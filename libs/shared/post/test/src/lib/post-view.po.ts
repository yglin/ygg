import { HtmlViewPageObjectCypress } from '@ygg/shared/omni-types/test';
import { Post } from '@ygg/shared/post/core';
import { TagsViewPageObjectCypress } from '@ygg/shared/tags/test';
import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { PageTitlePageObjectCypress } from '@ygg/shared/ui/test';
import { User } from '@ygg/shared/user/core';
import { UserThumbnailPageObjectCypress } from '@ygg/shared/user/test';

export class PostViewPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.post-view',
    title: '.title',
    tagsView: '.tags-view',
    contentView: '.content-view',
    createDate: '.create-date',
    author: '.author'
  };

  titlePO: PageTitlePageObjectCypress;
  tagsViewPO: TagsViewPageObjectCypress;
  contentViewPO: HtmlViewPageObjectCypress;
  userThumbnailPO: UserThumbnailPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.titlePO = new PageTitlePageObjectCypress(this.getSelector('title'));
    this.tagsViewPO = new TagsViewPageObjectCypress(
      this.getSelector('tagsView')
    );
    this.contentViewPO = new HtmlViewPageObjectCypress(
      this.getSelector('contentView')
    );
    this.userThumbnailPO = new UserThumbnailPageObjectCypress(
      this.getSelector('author')
    );
  }

  expectValue(post: Post): void {
    this.titlePO.expectText(post.title);
    this.tagsViewPO.expectValue(post.tags);
    this.contentViewPO.expectValue(post.content);
    // Can't assure the exact createAt date during test, we just make sure it's there
    cy.get(this.getSelector('createDate')).contains(
      /\d{4}\s\d{2}\/\d{2}\s\d{2}:\d{2}/gm
    );
  }

  expectAuthor(user: User): void {
    this.userThumbnailPO.expectUser(user);
  }
}
