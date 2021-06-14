import { DataAccessor } from '@ygg/shared/infra/core';
import { Authenticator } from '@ygg/shared/user/core';
import { Post } from './post';

export class PostFactory {
  constructor(
    protected dataAccessor: DataAccessor,
    protected authenticator: Authenticator
  ) {}

  async create(data: any = {}): Promise<Post> {
    const author = await this.authenticator.requestLogin();
    const post = new Post(this.dataAccessor, data);
    post.authorId = author.id;
    return post;
  }
}
