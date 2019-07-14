import { Injectable } from '@angular/core';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { Observable } from 'rxjs';
import { PlayTag } from './play-tag';
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
}
