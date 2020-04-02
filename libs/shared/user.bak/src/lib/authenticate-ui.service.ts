import { Injectable } from '@angular/core';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { User } from "@ygg/shared/user/core";

@Injectable({
  providedIn: 'root'
})
export class AuthenticateUiService {

  constructor(private dialog: YggDialogService) {}

  async openLoginDialog(): Promise<User> {
    return await this.dialog.open(LoginDialogComponent).afterClosed().toPromise();
  }
}
