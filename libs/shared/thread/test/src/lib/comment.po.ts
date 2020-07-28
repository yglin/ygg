import { CommentPageObject } from '@ygg/shared/thread/ui';
import { Comment } from '@ygg/shared/thread/core';
import { HtmlViewPageObjectCypress } from '@ygg/shared/omni-types/test';

export class CommentPageObjectCypress extends CommentPageObject {
  expectValue(comment: Comment) {
    cy.get(this.getSelector('author'))
      .invoke('attr', 'user-id')
      .should('equal', comment.ownerId);
    const htmlPO = new HtmlViewPageObjectCypress(this.getSelector('content'));
    htmlPO.expectValue(comment.content);
  }
}
