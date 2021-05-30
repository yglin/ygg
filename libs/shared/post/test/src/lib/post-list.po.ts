import { Post } from '@ygg/shared/post/core';
import { PageObjectCypress } from '@ygg/shared/test/cypress';

export class PostListPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.post-list',
    posts: '.posts'
  };

  expectTopPost(post: Post): void {
    this.expectPost(post, 0);
  }

  expectPost(post: Post, index: number): void {
    const contentPreviewText = post.content.toText().slice(0, 100);
    cy.get(`${this.getSelector('posts')} .post[index=${index}]`).contains(
      contentPreviewText
    );
  }
}
