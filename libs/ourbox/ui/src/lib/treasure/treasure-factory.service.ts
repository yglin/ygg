import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TreasureFactory } from '@ygg/ourbox/core';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { AuthenticateUiService } from '@ygg/shared/user/ui';
import { HeadQuarterService } from '../head-quarter.service';

@Injectable({
  providedIn: 'root'
})
export class TreasureFactoryService extends TreasureFactory {
  constructor(
    emcee: EmceeService,
    router: Router,
    authenticator: AuthenticateUiService,
    dataAccessor: FireStoreAccessService,
    headquarter: HeadQuarterService
  ) {
    super(emcee, router, authenticator, dataAccessor, headquarter);
  }
}
