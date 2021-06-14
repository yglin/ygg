import { Injectable } from '@angular/core';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';
import { PostFactory } from '@ygg/shared/post/core';
import { AuthenticateUiService } from '@ygg/shared/user/ui';

@Injectable({
  providedIn: 'root'
})
export class PostFactoryService extends PostFactory {
  constructor(
    dataAccessor: FireStoreAccessService,
    authenticator: AuthenticateUiService
  ) {
    super(dataAccessor, authenticator);
  }
}
