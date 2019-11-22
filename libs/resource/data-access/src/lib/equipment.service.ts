import { Injectable } from '@angular/core';
import { Equipment } from '@ygg/resource/core';
import { Observable, of } from 'rxjs';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  constructor(private dataAccessService: DataAccessService) { }

  loadData(data: any): Observable<Equipment> {
    return of(new Equipment().fromJSON(data));
  }

  get$(id: string): Observable<Equipment> {
    return this.dataAccessService.get$(Equipment.collection, id).pipe(
      switchMap(data => this.loadData(data))
    );
  }

  async upsert(equipment: Equipment) {
    return this.dataAccessService.upsert(Equipment.collection, equipment);
  }
}
