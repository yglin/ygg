import { Injectable } from '@angular/core';
import { InvitationFactory, Invitation } from '@ygg/shared/user/core';
import { UserService } from './user.service';
import {
  DataAccessService,
  FireStoreAccessService
} from '@ygg/shared/infra/data-access';
import { AuthenticateService } from './authenticate.service';
import { EmceeService, YggDialogService } from '@ygg/shared/ui/widgets';
import { InvitationAccessService } from './invitation-access.service';
import { AuthenticateUiService } from './authenticate-ui.service';
import { MailListControlComponent } from './components/mail-list/mail-list-control/mail-list-control.component';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InvitationFactoryService extends InvitationFactory
  implements Resolve<Invitation> {
  constructor(
    userAccessor: UserService,
    dataAccessor: FireStoreAccessService,
    authenticator: AuthenticateUiService,
    emcee: EmceeService,
    invitationAccessor: InvitationAccessService,
    dialog: YggDialogService,
    router: Router
  ) {
    super(
      userAccessor,
      dataAccessor,
      authenticator,
      emcee,
      invitationAccessor,
      dialog,
      router,
      MailListControlComponent
    );
  }

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Invitation> {
    try {
      const id = route.paramMap.get(':id');
      return this.confirm(id);
    } catch (error) {
      this.router.navigate(['/']);
    }
  }
}
