import { CommentListPageObject } from '@ygg/shared/thread/ui';
import { Comment } from '@ygg/shared/thread/core';
import { CommentPageObjectCypress } from './comment.po';

export class CommentListPageObjectCypress extends CommentListPageObject {
  getSelectorForCommentAt(index: number): string {
    return `${this.getSelector()} .comment[idx="${index}"]`;
  }

  expectComments(comments: Comment[]) {
    cy.get(`.comment[idx]`).should('have.length', comments.length);
    cy.wrap(comments).each((comment: Comment, index: number) => {
      const commentPO = new CommentPageObjectCypress(
        this.getSelectorForCommentAt(index)
      );
      commentPO.expectValue(comment);
    });
  }

  expectLatestComment(comment: Comment) {
    const commentPO = new CommentPageObjectCypress(
      this.getSelector('latestComment')
    );
    commentPO.expectValue(comment);
  }
}
