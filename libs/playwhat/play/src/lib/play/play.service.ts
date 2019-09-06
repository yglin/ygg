import { Injectable } from '@angular/core';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { Play } from './play';
import { Observable } from 'rxjs';
import { PlayTagService, PlayTag } from '../tag';

@Injectable({
  providedIn: 'root'
})
export class PlayService {
  collection = 'plays';

  constructor(
    private dataAccessService: DataAccessService,
    private playTagService: PlayTagService
  ) {}

  get$(id: string): Observable<Play> {
    return this.dataAccessService.get$(this.collection, id, Play);
  }

  async upsert(play: Play) {
    await this.playTagService.upsertList(play.tags.toTags() as PlayTag[]);
    return this.dataAccessService.upsert(this.collection, play, Play);
  }
}
