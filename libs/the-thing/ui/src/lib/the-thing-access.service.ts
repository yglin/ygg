import { Injectable } from '@angular/core';
// import { IDataAccessor } from '@ygg/shared/infra/core';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';
import { TheThingAccessor } from '@ygg/the-thing/core';

@Injectable({
  providedIn: 'root'
})
export class TheThingAccessService extends TheThingAccessor {
  constructor(dataAccessor: FireStoreAccessService) {
    super(dataAccessor);
  }
}
