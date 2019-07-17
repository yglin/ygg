import { find } from "lodash";
import { Injectable } from '@angular/core';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { Observable } from 'rxjs';
import { PlayTag } from './play-tag';
import { take } from 'rxjs/operators';
// import { map } from 'rxjs/operators';
// import { Tags } from '@ygg/shared/types';


@Injectable({
  providedIn: 'root'
})
export class PlayTagService {
  collection = 'play-tags';

  constructor(private dataAccessService: DataAccessService) { }

  list$(): Observable<PlayTag[]> {
    return this.dataAccessService.list$(this.collection, PlayTag);
  }

  listByIds$(ids: string[]): Observable<PlayTag[]> {
    return this.dataAccessService.listByIds$(this.collection, ids, PlayTag);
  }

  upsert(tag: PlayTag): Promise<PlayTag> {
    return this.dataAccessService.upsert(this.collection, tag, PlayTag);
  }

  /**
   * Only upsert those tags which are not in database
   * @param tags - Array of PlayTag
   */
  async upsertList(tags: PlayTag[]): Promise<PlayTag[]> {
    const tagsInStock: PlayTag[] = await this.list$().pipe(take(1)).toPromise();
    const newTags = tags.filter(tag => !find(tagsInStock, _tag => _tag.name === tag.name));
    return Promise.all(newTags.map(newTag => this.upsert(newTag)));
  }
}
