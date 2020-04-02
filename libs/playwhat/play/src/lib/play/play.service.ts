import { omit, isEmpty } from 'lodash';
import { Injectable } from '@angular/core';
import { DataAccessService, Query } from '@ygg/shared/infra/data-access';
import { Play } from './play';
import { Observable, of, combineLatest } from 'rxjs';
import { User } from "@ygg/shared/user/core";
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { Addition } from '@ygg/resource/core';
import { AdditionService } from '@ygg/resource/data-access';

@Injectable({
  providedIn: 'root'
})
export class PlayService {
  collection = 'plays';

  constructor(
    private dataAccessService: DataAccessService,
    private additionService: AdditionService
  ) {}

  loadAdditions(additionIds: string[]): Observable<Addition[]> {
    if (isEmpty(additionIds)) {
      return of([]);
    } else {
      return combineLatest(
        additionIds.map(id =>
          this.additionService.get$(id).pipe(catchError(error => of(null)))
        )
      ).pipe(
        map((additions: Addition[]) => additions.filter(eq => !isEmpty(eq)))
      );
    }
  }

  loadData(playData: any): Observable<Play> {
    const play = new Play().fromJSON(playData);
    return this.loadAdditions(playData.additions).pipe(
      map(eqs => {
        play.additions = eqs;
        return play;
      })
    );
  }

  get$(id: string): Observable<Play> {
    return this.dataAccessService
      .get$(this.collection, id)
      .pipe(switchMap((playData: any) => this.loadData(playData)));
  }

  list$(): Observable<Play[]> {
    return this.dataAccessService
      .list$(this.collection)
      .pipe(
        switchMap((playDataArray: any[]) =>
          isEmpty(playDataArray)
            ? of([])
            : combineLatest(
                playDataArray.map(playData => this.loadData(playData))
              )
        )
      );
  }

  listByCreator$(user: User): Observable<Play[]> {
    const queries = [new Query('creatorId', '==', user.id)];
    return this.dataAccessService.find$(this.collection, queries, Play);
  }

  async upsert(play: Play) {
    const data = play.toJSON();
    try {
      await this.dataAccessService.upsert(this.collection, data);
      return Promise.all(
        play.additions.map(eq => this.additionService.upsert(eq))
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
