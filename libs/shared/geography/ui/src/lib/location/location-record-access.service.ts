import { Injectable } from '@angular/core';
import { LocationRecordAccessor } from '@ygg/shared/geography/core';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';

@Injectable({
  providedIn: 'root'
})
export class LocationRecordAccessService extends LocationRecordAccessor {
  constructor(dataAccessor: FireStoreAccessService) {
    super(dataAccessor);
  }
}
