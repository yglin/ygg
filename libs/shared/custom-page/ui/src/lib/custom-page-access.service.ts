import { Injectable } from '@angular/core';
import { CustomPageAccessor } from '@ygg/shared/custom-page/core';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';

@Injectable({
  providedIn: 'root'
})
export class CustomPageAccessService extends CustomPageAccessor {
  constructor(dataAccessor: FireStoreAccessService) {
    super(dataAccessor);
  }
}
