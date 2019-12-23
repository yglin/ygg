import { Injectable } from '@angular/core';
import { Addition } from '@ygg/resource/core';
import { Observable, of } from 'rxjs';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdditionService {

  constructor(private dataAccessService: DataAccessService) { }

  loadData(data: any): Observable<Addition> {
    return of(new Addition().fromJSON(data));
  }

  get$(id: string): Observable<Addition> {
    return this.dataAccessService.get$(Addition.collection, id).pipe(
      switchMap(data => this.loadData(data))
    );
  }

  async upsert(addition: Addition) {
    return this.dataAccessService.upsert(Addition.collection, addition);
  }
}
