import { omit, isEmpty } from 'lodash';
import { Injectable } from '@angular/core';
import { DataAccessService, Query } from '@ygg/shared/infra/data-access';
import { Play } from './play';
import { Observable, of, combineLatest } from 'rxjs';
import { User } from '@ygg/shared/user';
import { map, switchMap, tap } from 'rxjs/operators';
import { Equipment } from '@ygg/resource/core';
import { EquipmentService } from '@ygg/resource/data-access';

@Injectable({
  providedIn: 'root'
})
export class PlayService {
  collection = 'plays';

  constructor(
    private dataAccessService: DataAccessService,
    private equipmentService: EquipmentService
  ) {}

  loadEquipments(equipmentIds: string[]): Observable<Equipment[]> {
    if (isEmpty(equipmentIds)) {
      return of([]);
    } else {
      return combineLatest(
        equipmentIds.map(id => this.equipmentService.get$(id))
      );
    }
  }

  loadData(playData: any): Observable<Play> {
    const play = new Play().fromJSON(playData);
    return this.loadEquipments(playData.equipments).pipe(
      map(eqs => {
        play.equipments = eqs;
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
        play.equipments.map(eq => this.equipmentService.upsert(eq))
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
