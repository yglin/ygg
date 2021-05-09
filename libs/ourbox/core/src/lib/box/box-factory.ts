import { LocationRecordAccessor } from '@ygg/shared/geography/core';
import {
  DataAccessor,
  Emcee,
  HeadQuarter,
  Query
} from '@ygg/shared/infra/core';
import { wrapError } from '@ygg/shared/infra/error';
import { Authenticator } from '@ygg/shared/user/core';
import { find, isEmpty } from 'lodash';
import { Treasure, TreasureFinder } from '../treasure';
import { Box } from './box';
import { RelationBoxTreasure } from './box-treasure';

export class BoxFactory {
  constructor(
    protected dataAccessor: DataAccessor,
    protected authenticator: Authenticator,
    protected headquarter: HeadQuarter,
    protected emcee: Emcee,
    protected locationRecordAccessor: LocationRecordAccessor,
    protected treasureFinder: TreasureFinder
  ) {}

  async create(data: any = {}): Promise<Box> {
    try {
      const newBox = new Box(
        this.dataAccessor,
        this.authenticator,
        this.headquarter,
        this.emcee,
        this.locationRecordAccessor,
        data
      );
      const queries = [new Query('boxId', '==', newBox.id)];
      const relationBoxTreasures: RelationBoxTreasure[] = await this.dataAccessor.find(
        RelationBoxTreasure.collection,
        queries
      );
      newBox.treasures = await this.treasureFinder.listByIds(
        relationBoxTreasures.map(r => r.treasureId)
      );
      return newBox;
    } catch (error) {
      const wrpErr = wrapError(error, `Failed to create box object`);
      return Promise.reject(wrpErr);
    }
  }

  async addTreasureToBox(treasure: Treasure, box: Box) {
    try {
      const relaitonBoxTreasure = new RelationBoxTreasure(this.dataAccessor, {
        boxId: box.id,
        treasureId: treasure.id
      });
      await relaitonBoxTreasure.save();
      if (
        isEmpty(box.treasures) ||
        !find(box.treasures, t => t.id === treasure.id)
      ) {
        box.treasures.push(treasure);
      }
    } catch (error) {
      const wrpErr = wrapError(
        error,
        `Failed to add treasure ${treasure.name} into box ${box.name}`
      );
      return Promise.reject(wrpErr);
    }
  }
}
