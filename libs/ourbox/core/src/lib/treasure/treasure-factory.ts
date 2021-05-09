import {
  DataAccessor,
  Emcee,
  HeadQuarter,
  Router
} from '@ygg/shared/infra/core';
import { Authenticator } from '@ygg/shared/user/core';
import { Treasure } from './treasure';

export class TreasureFactory {
  cache: { [id: string]: Treasure } = {};

  constructor(
    protected emcee: Emcee,
    protected router: Router,
    protected authenticator: Authenticator,
    protected dataAccessor: DataAccessor,
    protected headquarter: HeadQuarter
  ) {}

  create(data: any = {}): Treasure {
    if (data && data.id && data.id in this.cache) {
      return this.cache[data.id];
    } else {
      const treasure = new Treasure(
        this.emcee,
        this.router,
        this.authenticator,
        this.dataAccessor,
        this.headquarter,
        data
      );
      this.cache[treasure.id] = treasure;
      return treasure;
    }
  }
}
