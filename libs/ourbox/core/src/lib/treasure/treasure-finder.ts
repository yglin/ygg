import { DataAccessor, Query } from '@ygg/shared/infra/core';
import { User } from '@ygg/shared/user/core';
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

  async findById(id: string): Promise<Treasure> {
    const treasureData = await this.dataAccessor.load(Treasure.collection, id);
    return this.treasureFactory.create(treasureData);
  }

  async findByOwner(owner: User): Promise<Treasure[]> {
    const query = Treasure.queryOwner(owner);
    const treasureDatas = await this.dataAccessor.find(Treasure.collection, [
      query
    ]);
    return treasureDatas.map(data => this.treasureFactory.create(data));
  }
}
