import { Injectable } from '@angular/core';
import { BoxFactory } from '@ygg/ourbox/core';
import { LocationRecordAccessService } from '@ygg/shared/geography/ui';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { AuthenticateUiService } from '@ygg/shared/user/ui';
import { HeadQuarterService } from '../head-quarter.service';
import { TreasureFinderService } from '../treasure/treasure-finder.service';

@Injectable({
  providedIn: 'root'
})
export class BoxFactoryService extends BoxFactory {
  constructor(
    dataAccessor: FireStoreAccessService,
    auth: AuthenticateUiService,
    headquarter: HeadQuarterService,
    emcee: EmceeService,
    locationRecordAccessor: LocationRecordAccessService,
    treasureFinder: TreasureFinderService
  ) {
    super(
      dataAccessor,
      auth,
      headquarter,
      emcee,
      locationRecordAccessor,
      treasureFinder
    );
  }
}
