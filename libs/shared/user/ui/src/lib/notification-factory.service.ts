import { Injectable } from '@angular/core';
import { NotificationFactory, Notification } from '@ygg/shared/user/core';
import { UserService } from './user.service';
import {
  DataAccessService,
  FireStoreAccessService
} from '@ygg/shared/infra/data-access';
import { AuthenticateService } from './authenticate.service';
import { EmceeService, YggDialogService } from '@ygg/shared/ui/widgets';
import { NotificationAccessService } from './notification-access.service';
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
export class NotificationFactoryService extends NotificationFactory
  implements Resolve<Notification> {
  constructor(
    userAccessor: UserService,
    dataAccessor: FireStoreAccessService,
    authenticator: AuthenticateUiService,
    emcee: EmceeService,
    notificationAccessor: NotificationAccessService,
    dialog: YggDialogService,
    router: Router
  ) {
    super(
      userAccessor,
      dataAccessor,
      authenticator,
      emcee,
      notificationAccessor,
      dialog,
      router,
      MailListControlComponent
    );
  }

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Notification> {
    try {
      const id = route.paramMap.get('id');
      return this.confirm(id);
    } catch (error) {
      this.router.navigate(['/']);
    }
  }
}
