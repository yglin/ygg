import { Injectable } from '@angular/core';
import { DataAccessService, Query } from '@ygg/shared/infra/data-access';
import { Play } from './play';
import { Observable } from 'rxjs';
import { User } from '@ygg/shared/user';

@Injectable({
  providedIn: 'root'
})
export class PlayService {
  collection = 'plays';

  constructor(
    private dataAccessService: DataAccessService
  ) {}

  get$(id: string): Observable<Play> {
    return this.dataAccessService.get$(this.collection, id, Play);
  }

  list$():Observable<Play[]> {
    return this.dataAccessService.list$(this.collection, Play);
  }

  listByCreator$(user: User): Observable<Play[]> {
    const queries = [new Query('creatorId', '==', user.id)];
    return this.dataAccessService.find$(this.collection, queries, Play);
  }

  async upsert(play: Play) {
    return this.dataAccessService.upsert(this.collection, play, Play);
  }
}
