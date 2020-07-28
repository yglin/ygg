import { PageObject } from '@ygg/shared/test/page-object';
import { Comment } from '@ygg/shared/thread/core';

export abstract class CommentListPageObject extends PageObject {
  selectors = {
    main: '.comment-list',
    latestComment: '.latest'
  };

  abstract expectLatestComment(comment: Comment): void;
}
