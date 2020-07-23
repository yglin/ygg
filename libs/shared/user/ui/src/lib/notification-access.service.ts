import { Injectable } from '@angular/core';
import { NotificationAccessor } from '@ygg/shared/user/core';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';

@Injectable({
  providedIn: 'root'
})
export class NotificationAccessService extends NotificationAccessor {
  constructor(dataAccessor: FireStoreAccessService) {
    super(dataAccessor);
  }
}
