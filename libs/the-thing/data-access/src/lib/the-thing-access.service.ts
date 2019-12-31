import { Injectable } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TheThingAccessService {
  constructor(private dataAccessService: DataAccessService) {}

  get$(id: string): Observable<TheThing> {
    return this.dataAccessService
      .get$(TheThing.collection, id)
      .pipe(map(data => new TheThing().fromJSON(data)));
  }

  async upsert(theThing: TheThing): Promise<TheThing> {
    await this.dataAccessService.upsert(theThing.collection, theThing.toJSON());
    return Promise.resolve(theThing);
  }
}
