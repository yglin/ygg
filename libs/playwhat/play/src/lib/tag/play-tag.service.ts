import { find } from 'lodash';
import { Injectable } from '@angular/core';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { Observable, combineLatest } from 'rxjs';
import { PlayTag } from './play-tag';
import { take, map } from 'rxjs/operators';
import { PlayAdminService } from '../admin/play-admin.service';

@Injectable({
  providedIn: 'root'
})
export class PlayTagService {
  collection = 'play-tags';
  playTags$: Observable<PlayTag[]>;

  constructor(
    private dataAccessService: DataAccessService,
    private playAdminService: PlayAdminService
  ) {
    const allTags$ = this.list$();
    const playTagIds$ = this.playAdminService.getData$<string[]>('tags');
    this.playTags$ = combineLatest([allTags$, playTagIds$]).pipe(
      map(([allTags, playTagIds]) => {
        return allTags.filter(tag => playTagIds.indexOf(tag.id) >= 0);
      })
    );
  }

  list$(): Observable<PlayTag[]> {
    return this.dataAccessService.list$(this.collection, PlayTag);
  }

  listByIds$(ids: string[]): Observable<PlayTag[]> {
    return this.dataAccessService.listByIds$(this.collection, ids, PlayTag);
  }

  upsert(tag: PlayTag): Promise<PlayTag> {
    return this.dataAccessService.upsert(this.collection, tag, PlayTag);
  }

  async delete(tag: PlayTag) {
    return await this.dataAccessService.delete(this.collection, tag.id);
  }

  async deleteList(tags: PlayTag[]) {
    return await Promise.all(tags.map(tag => this.delete(tag)));
  }

  /**
   * Upsert a bunch of play tags.
   * Only upsert those tags which are not in database, unique by name.
   * @param tags - Array of PlayTags to be upserted
   */
  async upsertList(tags: PlayTag[]): Promise<PlayTag[]> {
    const tagsInStock: PlayTag[] = await this.list$()
      .pipe(take(1))
      .toPromise();
    const newTags = tags.filter(
      tag => !find(tagsInStock, _tag => _tag.name === tag.name)
    );
    return Promise.all(newTags.map(newTag => this.upsert(newTag)));
  }
}
