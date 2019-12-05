import { Injectable } from '@angular/core';
import { ResourceService } from "../resource";
import { Accommodation, ResourceType } from '@ygg/resource/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccommodationService {

  constructor(private resourceService: ResourceService) { }

  list$(): Observable<Accommodation[]> {
    return this.resourceService.listByType$<Accommodation>(ResourceType.Accommodation);
  }
}
