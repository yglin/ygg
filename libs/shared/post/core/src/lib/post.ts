import { extend, omit, defaults, isArray } from 'lodash';
import { DataAccessor, generateID, toJSONDeep } from '@ygg/shared/infra/core';
import { Html } from '@ygg/shared/omni-types/core';
import { Tags } from '@ygg/shared/tags/core';
import { wrapError } from '@ygg/shared/infra/error';

export class Post {
  static collection = 'posts';

  id: string;
  title: string;
  content: Html;
  createAt: Date;
  authorId: string;
  tags: Tags;

  static forge(): Post {
    const forged = new Post(null);
    forged.title = `Some post ${Date.now()}`;
    forged.content = Html.forge();
    forged.tags = Tags.forge();
    return forged;
  }

  static deserialize(dataAccessor: DataAccessor, data: any = {}): Post {
    return new Post(dataAccessor, data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private dataAccessor: DataAccessor, options: any = {}) {
    extend(this, options);
    if (isArray(options.tags)) {
      this.tags = new Tags(options.tags);
    }
    if (typeof options.content === 'string') {
      this.content = new Html(options.content);
    }
    defaults(this, {
      id: generateID(),
      createAt: new Date(),
      tags: new Tags()
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update(values: any = {}): void {
    extend(this, omit(values, ['id']));
  }

  async save(): Promise<void> {
    try {
      await this.dataAccessor.save(Post.collection, this.id, this.toJSON());
    } catch (error) {
      console.error(error);
      const wrpErr = wrapError(error, `Failed to save post`);
      return Promise.reject(wrpErr);
    }
  }

  toJSON(): any {
    return toJSONDeep(this);
  }
}
