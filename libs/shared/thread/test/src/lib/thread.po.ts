import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { Comment } from '@ygg/shared/thread/core';
import { CommentListPageObjectCypress } from './comment-list.po';
import { HtmlControlPageObjectCypress } from '@ygg/shared/omni-types/test';

export class ThreadPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.thread',
    commentList: '.comment-list',
    newComment: '.new-comment',
    buttonAdd: 'button.add-comment'
  };

  commentsPO: CommentListPageObjectCypress;
  htmlControlPO: HtmlControlPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.commentsPO = new CommentListPageObjectCypress(
      this.getSelector('commentList')
    );
    this.htmlControlPO = new HtmlControlPageObjectCypress(
      this.getSelector('newComment')
    );
  }

  addComment(comment: Comment) {
    this.htmlControlPO.setValue(comment.content);
    cy.get(this.getSelector('buttonAdd')).click();
  }

  expectLatestComment(comment: Comment) {
    this.commentsPO.expectLatestComment(comment);
  }

  expectComments(comments: Comment[]) {
    this.commentsPO.expectComments(comments);
  }
}
