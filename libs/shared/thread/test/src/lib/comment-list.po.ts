import { CommentListPageObject } from '@ygg/shared/thread/ui';
import { Comment } from '@ygg/shared/thread/core';
import { CommentPageObjectCypress } from './comment.po';

export class CommentListPageObjectCypress extends CommentListPageObject {
  expectLatestComment(comment: Comment) {
    const commentPO = new CommentPageObjectCypress(
      this.getSelector('latestComment')
    );
    commentPO.expectValue(comment);
  }
}
