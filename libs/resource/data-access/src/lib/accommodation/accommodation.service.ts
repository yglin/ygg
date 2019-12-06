import { Injectable } from '@angular/core';
import { ResourceService } from '../resource';
import { Accommodation, ResourceType } from '@ygg/resource/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {
  constructor(private resourceService: ResourceService) {}

  list$(): Observable<Accommodation[]> {
    return this.resourceService.listByType$<Accommodation>(
      ResourceType.Accommodation
    );
  }

  get$(id: string): Observable<Accommodation> {
    return this.resourceService
      .get$(id)
      .pipe(map(data => new Accommodation().fromJSON(data)));
  }

  async upsert(accommodation: Accommodation) {
    return this.resourceService.upsert(accommodation);
  }
}
