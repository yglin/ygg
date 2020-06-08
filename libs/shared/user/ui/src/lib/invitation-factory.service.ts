import { Injectable } from '@angular/core';
import { InvitationFactory } from '@ygg/shared/user/core';
import { UserService } from './user.service';
import {
  DataAccessService,
  FireStoreAccessService
} from '@ygg/shared/infra/data-access';
import { AuthenticateService } from './authenticate.service';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { InvitationAccessService } from './invitation-access.service';
import { AuthenticateUiService } from './authenticate-ui.service';

@Injectable({
  providedIn: 'root'
})
export class InvitationFactoryService extends InvitationFactory {
  constructor(
    userAccessor: UserService,
    dataAccessor: FireStoreAccessService,
    authenticator: AuthenticateUiService,
    emcee: EmceeService,
    invitationAccessor: InvitationAccessService
  ) {
    super(userAccessor, dataAccessor, authenticator, emcee, invitationAccessor);
  }
}
