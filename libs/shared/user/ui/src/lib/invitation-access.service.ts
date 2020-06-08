import { Injectable } from '@angular/core';
import { InvitationAccessor } from '@ygg/shared/user/core';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';

@Injectable({
  providedIn: 'root'
})
export class InvitationAccessService extends InvitationAccessor {
  constructor(dataAccessor: FireStoreAccessService) {
    super(dataAccessor);
  }
}
