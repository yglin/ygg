import { DataAccessor } from '@ygg/shared/infra/core';
import { wrapError } from '@ygg/shared/infra/error';
import { TagsFinder } from '@ygg/shared/tags/core';
import { isEmpty } from 'lodash';
import { Post } from './post';
import { PostFactory } from './post-factory';

export class PostFinder {
  constructor(
    protected dataAccessor: DataAccessor,
    protected postFactory: PostFactory,
    protected tagsFinder: TagsFinder
  ) {}

  async find(queries: any = {}): Promise<Post[]> {
    try {
      if (isEmpty(queries)) {
        return this.listAll();
      } else {
        // console.dir(queries);
        let posts: Post[] = [];
        if ('tags' in queries) {
          posts = await this.findWithTags(queries['tags']);
        }
        return posts;
      }
    } catch (error) {
      const wrpErr = wrapError(
        error,
        `Failed to find posts with querys ${JSON.stringify(queries)}`
      );
      return Promise.reject(wrpErr);
    }
  }

  async findWithTags(tags: string[]): Promise<Post[]> {
    try {
      const postsIds = await this.tagsFinder.findIdsByTags(
        Post.collection,
        tags
      );
      return this.listByIds(postsIds);
    } catch (error) {
      const wrpErr = wrapError(error, `Failed to find posts by tags ${tags}`);
      return Promise.reject(wrpErr);
    }
  }

  async listByIds(ids: string[]): Promise<Post[]> {
    try {
      const dataItems = await this.dataAccessor.listByIds(Post.collection, ids);
      return dataItems.map(data => Post.deserialize(this.dataAccessor, data));
    } catch (error) {
      const wrpErr = wrapError(error, `Failed to list posts by ids ${ids}`);
      return Promise.reject(wrpErr);
    }
  }

  async listAll(): Promise<Post[]> {
    const dataItems = await this.dataAccessor.list(Post.collection);
    return dataItems.map(data => Post.deserialize(this.dataAccessor, data));
  }

  async getById(id: string): Promise<Post> {
    try {
      const data = await this.dataAccessor.load(Post.collection, id);
      // console.dir(data);
      return Post.deserialize(this.dataAccessor, data);
    } catch (error) {
      const wrpErr = wrapError(error, `Failed to get post by id ${id}`);
      return Promise.reject(wrpErr);
    }
  }
}
