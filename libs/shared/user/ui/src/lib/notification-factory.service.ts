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
import { isEmpty } from 'lodash';

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
    router: Router,
    private dialog: YggDialogService
  ) {
    super(
      userAccessor,
      dataAccessor,
      authenticator,
      emcee,
      notificationAccessor,
      router
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
      const wrapError = new Error(
        `Failed to resolve route ${route.url}.\n${error.message}`
      );
      return Promise.reject(wrapError);
    } finally {
      this.router.navigate(['/']);
    }
  }

  async inquireEmails(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(MailListControlComponent, {
        title: '新增通知Email'
      });
      dialogRef.afterClosed().subscribe(
        emails => {
          if (!isEmpty(emails)) {
            resolve(emails);
          } else {
            resolve([]);
          }
        },
        error => reject(error)
      );
    });
  }
}
