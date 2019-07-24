import { Injectable } from '@angular/core';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { Play } from './play';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayService {
  collection = 'plays';

  constructor(private dataAccessService: DataAccessService) { }

  get$(id: string): Observable<Play> {
    return this.dataAccessService.get$(this.collection, id, Play);
  }

  async upsert(play: Play) {
    return this.dataAccessService.upsert(this.collection, play, Play);
  }
}
