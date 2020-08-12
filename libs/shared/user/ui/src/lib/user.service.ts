import { Injectable } from '@angular/core';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';
import { UserAccessor } from '@ygg/shared/user/core';

@Injectable({ providedIn: 'root' })
export class UserService extends UserAccessor {
  constructor(dataAccessor: FireStoreAccessService) {
    super(dataAccessor);
  }
}
