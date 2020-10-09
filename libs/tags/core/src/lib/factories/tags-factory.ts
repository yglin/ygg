import { DataAccessor } from '@ygg/shared/infra/core';
import { defaults, orderBy } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tag, Tags } from '../models';
import { TagsAccessor } from './tags-accessor';

export abstract class TagsFactory {
  constructor(protected tagsAccessor: TagsAccessor) {}

  listTopPopular$(options: { count?: number } = {}): Observable<Tag[]> {
    options = defaults(options, { count: 10 });
    return this.tagsAccessor.listAll$().pipe(
      map(tags => {
        const topTags = orderBy(tags, ['popularity'], 'desc').slice(0, options.count);
        return topTags;
      })
    );
  }
}
