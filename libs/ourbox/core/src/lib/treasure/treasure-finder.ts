import { DataAccessor } from '@ygg/shared/infra/core';
import { Treasure } from './treasure';
import { TreasureFactory } from './treasure-factory';

export class TreasureFinder {
  constructor(
    protected dataAccessor: DataAccessor,
    protected treasureFactory: TreasureFactory
  ) {}

  async listByIds(ids: string[]): Promise<Treasure[]> {
    const treasureDatas = await this.dataAccessor.listByIds(
      Treasure.collection,
      ids
    );
    // console.dir(treasureDatas);
    return treasureDatas.map(data => this.treasureFactory.create(data));
  }
}
