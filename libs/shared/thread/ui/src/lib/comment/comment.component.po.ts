import { PageObject } from '@ygg/shared/test/page-object';
import { Comment } from '@ygg/shared/thread/core';

export abstract class CommentPageObject extends PageObject {
  selectors = {
    main: '.comment',
    author: '.author',
    content: '.content'
  };

  abstract expectValue(comment: Comment): void;
}
