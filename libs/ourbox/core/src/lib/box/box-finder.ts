import { DataAccessor, Query } from '@ygg/shared/infra/core';
import { wrapError } from '@ygg/shared/infra/error';
import { User } from '@ygg/shared/user/core';
import { isArray } from 'lodash';
import { Treasure } from '../treasure';
import { Box } from './box';
import { BoxFactory } from './box-factory';
import { RelationBoxTreasure } from './box-treasure';
import { UserBoxRelation } from './user-box';

export class BoxFinder {
  constructor(
    protected dataAccessor: DataAccessor,
    protected boxFactory: BoxFactory
  ) {}

  async countUserBoxes(user: User): Promise<number> {
    try {
      const queries = [new Query('ownerId', '==', user.id)];
      const userBoxes = await this.dataAccessor.find(Box.collection, queries);
      return isArray(userBoxes) ? userBoxes.length : 0;
    } catch (error) {
      const wrpErr = wrapError(
        error,
        `Failed to count boxes of user ${user.name}`
      );
      return Promise.reject(wrpErr);
    }
  }

  async findUserBoxes(user: User): Promise<Box[]> {
    try {
      const queries = [new Query('ownerId', '==', user.id)];
      const userBoxes: Box[] = await this.dataAccessor
        .find(Box.collection, queries)
        .then(items => items.map(item => this.boxFactory.create(item)));
      return userBoxes;
    } catch (error) {
      const wrpErr = wrapError(
        error,
        `Failed to find boxes of user ${user.name}`
      );
      return Promise.reject(wrpErr);
    }
  }

  async findByTreasure(treasure: Treasure): Promise<Box[]> {
    const queries: Query[] = RelationBoxTreasure.queryBoxesByTreasure(treasure);
    const relations: RelationBoxTreasure[] = await this.dataAccessor.find(
      RelationBoxTreasure.collection,
      queries
    );
    const boxIds: string[] = relations.map(r => r.boxId);
    return this.dataAccessor
      .listByIds(Box.collection, boxIds)
      .then(items => items.map(item => this.boxFactory.create(item)));
  }
}
