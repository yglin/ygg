import { Injectable } from '@angular/core';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';
import { TheThingSource } from '@ygg/the-thing/core';

@Injectable({
  providedIn: 'root'
})
export class TheThingSourceService extends TheThingSource {
  constructor(dataAccessor: FireStoreAccessService) {
    super(dataAccessor);
  }
}
