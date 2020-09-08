import { Injectable } from '@angular/core';
import { UserFactory, IUsersByEmail } from '@ygg/shared/user/core';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { UsersByEmailSelectorComponent } from './components/users-by-email-selector/users-by-email-selector.component';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserFactoryService extends UserFactory {
  constructor(private dialog: YggDialogService) {
    super();
  }

  async selectUsersByEmail(): Promise<IUsersByEmail> {
    try {
      const dialogRef = this.dialog.open(UsersByEmailSelectorComponent, {
        title: '使用Email搜尋選擇用戶',
        data: {}
      });
      const usersByEmail: IUsersByEmail = await dialogRef
        .afterClosed()
        .pipe(take(1))
        .toPromise();
      return usersByEmail;
    } catch (error) {
      const wrapError = new Error(
        `Failed to select users by email.\n${error.message}`
      );
      return Promise.reject(wrapError);
    }
  }
}
