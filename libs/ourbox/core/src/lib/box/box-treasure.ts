import { DataAccessor, Query } from '@ygg/shared/infra/core';
import { wrapError } from '@ygg/shared/infra/error';
import { extend } from 'lodash';
import { Treasure } from '../treasure';
import { Box } from './box';

export class RelationBoxTreasure {
  static collection = 'boxes-treasures';

  boxId: string;
  treasureId: string;

  constructor(
    protected dataAccessor: DataAccessor,
    options: {
      boxId: string;
      treasureId: string;
    }
  ) {
    extend(this, options);
  }

  static queryBoxesByTreasure(treasure: Treasure): Query[] {
    return [new Query('treasureId', '==', treasure.id)];
  }

  static queryTreasuresByBox(box: Box): Query[] {
    return [new Query('boxId', '==', box.id)];
  }

  get id() {
    return `${this.boxId}_${this.treasureId}`;
  }

  async save() {
    try {
      await this.dataAccessor.save(
        RelationBoxTreasure.collection,
        this.id,
        this.toJSON()
      );
    } catch (error) {
      const wrpErr = wrapError(
        error,
        `Failed to save relation box ${this.boxId} to treasure ${this.treasureId}`
      );
      return Promise.reject(wrpErr);
    }
  }

  toJSON(): any {
    return {
      id: this.id,
      boxId: this.boxId,
      treasureId: this.treasureId
    };
  }
}
