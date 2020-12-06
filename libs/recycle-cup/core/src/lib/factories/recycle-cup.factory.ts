import { DataAccessor, Emcee } from '@ygg/shared/infra/core';
import { Authenticator } from '@ygg/shared/user/core';
import { RecycleCup } from '../models/recycle-cup';

export class RecycleCupFactory {
  constructor(
    protected dataAccessor: DataAccessor,
    protected emcee: Emcee,
    protected authenticator: Authenticator
  ) {}

  async create(): Promise<RecycleCup> {
    const recycleCup = new RecycleCup(this.dataAccessor, this.emcee);
    if (this.authenticator.currentUser) {
      recycleCup.ownerId = this.authenticator.currentUser.id;
    }
    return recycleCup;
  }
}
