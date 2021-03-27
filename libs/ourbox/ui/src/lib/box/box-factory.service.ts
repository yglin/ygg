import { Injectable } from '@angular/core';
import { BoxFactory } from '@ygg/ourbox/core';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { AuthenticateUiService } from '@ygg/shared/user/ui';
import { HeadQuarterService } from '../head-quarter.service';

@Injectable({
  providedIn: 'root'
})
export class BoxFactoryService extends BoxFactory {
  constructor(
    dataAccessor: FireStoreAccessService,
    auth: AuthenticateUiService,
    headquarter: HeadQuarterService,
    emcee: EmceeService
  ) {
    super(dataAccessor, auth, headquarter, emcee);
  }
}
