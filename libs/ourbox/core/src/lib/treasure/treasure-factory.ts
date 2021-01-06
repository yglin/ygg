import { Router } from '@ygg/shared/infra/core';
import { Treasure } from './treasure';

export class TreasureFactory {
  constructor(protected router: Router) {}

  async create(): Promise<Treasure> {
    const treasure = new Treasure(this.router);
    return treasure;
  }
}
