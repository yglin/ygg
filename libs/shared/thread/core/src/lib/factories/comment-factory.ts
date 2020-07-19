import { Observable } from 'rxjs';
import { Html } from '@ygg/shared/omni-types/core';
import { EntityAccessor, Emcee, Query } from '@ygg/shared/infra/core';
import { Comment } from '../models';
import { Authenticator, User } from '@ygg/shared/user/core';
import { CommentAccessor } from './comment-accessor';

export class CommentFactory {
  constructor(
    protected commentAccessor: CommentAccessor,
    protected autheticator: Authenticator,
    protected emcee: Emcee
  ) {}

  async addComment(subjectId: string, content: Html) {
    try {
      const user: User = await this.autheticator.requestLogin();
      const comment = new Comment({
        subjectId,
        ownerId: user.id,
        content
      });
      return this.commentAccessor.save(comment);
    } catch (error) {
      this.emcee.error(`新增留言失敗，錯誤原因：${error.message}`);
      return Promise.resolve();
    }
  }

  listBySubjectId$(subjectId: string): Observable<Comment[]> {
    const queries: Query[] = [new Query('subjectId', '==', subjectId)];
    return this.commentAccessor.find$(queries);
  }
}
