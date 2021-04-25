import {
  DataAccessor,
  Emcee,
  HeadQuarter,
  Router
} from '@ygg/shared/infra/core';
import { Authenticator } from '@ygg/shared/user/core';
import { Treasure } from './treasure';

export class TreasureFactory {
  constructor(
    protected emcee: Emcee,
    protected router: Router,
    protected authenticator: Authenticator,
    protected dataAccessor: DataAccessor,
    protected headquarter: HeadQuarter
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
