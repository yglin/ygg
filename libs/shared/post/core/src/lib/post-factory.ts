import { DataAccessor } from '@ygg/shared/infra/core';
import { Post } from './post';

export class PostFactory {
  constructor(protected dataAccessor: DataAccessor) {}

  async create(data: any = {}): Promise<Post> {
    const post = new Post(this.dataAccessor, data);
    return post;
  }
}
