import {
  GeoBound,
  LocationRecord,
  MapFinder
} from '@ygg/shared/geography/core';
import { DataAccessor, Query } from '@ygg/shared/infra/core';
import { wrapError } from '@ygg/shared/infra/error';
import { User } from '@ygg/shared/user/core';
import { isArray } from 'lodash';
import { Treasure, TreasureFinder } from '../treasure';
import { Box } from './box';
import { BoxFactory } from './box-factory';
import { RelationBoxTreasure } from './box-treasure';
import { UserBoxRelation } from './user-box';

export class BoxFinder {
  constructor(
    protected dataAccessor: DataAccessor,
    protected boxFactory: BoxFactory,
    protected treasureFinder: TreasureFinder,
    protected mapFinder: MapFinder
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

  async findById(id: string): Promise<Box> {
    try {
      const boxData = await this.dataAccessor.load(Box.collection, id);
      if (!!boxData) {
        return this.boxFactory.create(boxData);
      } else {
        throw new Error(`Load empty data ${boxData}`);
      }
    } catch (error) {
      const wrpErr = wrapError(error, `Failed to load box by id ${id}`);
      return Promise.reject(error);
    }
  }

  async findByIds(ids: string[]): Promise<Box[]> {
    try {
      const dataItems = await this.dataAccessor.listByIds(Box.collection, ids);
      return dataItems.map(dataItem => this.boxFactory.create(dataItem));
    } catch (error) {
      const wrpErr = wrapError(error, `Failed to load box by ids ${ids}`);
      console.error(wrpErr.message);
      return Promise.reject(error);
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

  async findTreasuresInBox(box: Box): Promise<Treasure[]> {
    const queries: Query[] = RelationBoxTreasure.queryTreasuresByBox(box);
    const relations: RelationBoxTreasure[] = await this.dataAccessor.find(
      RelationBoxTreasure.collection,
      queries
    );
    // console.dir(relations);
    return this.treasureFinder.listByIds(relations.map(r => r.treasureId));
  }

  async findPublicBoxesInMapBound(bound: GeoBound): Promise<Box[]> {
    const locationRecods: LocationRecord[] = await this.mapFinder.findInBound(
      bound
    );
    // console.dir(locationRecods);
    const locaitonRecordsOfBoxes = locationRecods.filter(
      lr => lr.objectCollection === Box.collection
    );
    const boxes: Box[] = await this.findByIds(
      locaitonRecordsOfBoxes.map(lr => lr.objectId)
    );
    return boxes.filter(b => b.public);
  }
}
