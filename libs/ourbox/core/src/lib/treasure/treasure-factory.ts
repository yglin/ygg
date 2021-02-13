import { DataAccessor, Emcee, Router } from '@ygg/shared/infra/core';
import { Authenticator } from '@ygg/shared/user/core';
import { OurboxHeadQuarter } from '../head-quarter';
import { Treasure } from './treasure';

export class TreasureFactory {
  constructor(
    protected emcee: Emcee,
    protected router: Router,
    protected authenticator: Authenticator,
    protected dataAccessor: DataAccessor,
    protected headquarter: OurboxHeadQuarter
  ) {}

  create(data: any = {}): Treasure {
    const treasure = new Treasure(
      this.emcee,
      this.router,
      this.authenticator,
      this.dataAccessor,
      this.headquarter,
      data
    );
    return treasure;
  }
}
