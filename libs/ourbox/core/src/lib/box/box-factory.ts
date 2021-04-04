import { LocationRecordAccessor } from '@ygg/shared/geography/core';
import { DataAccessor, Emcee } from '@ygg/shared/infra/core';
import { wrapError } from '@ygg/shared/infra/error';
import { Authenticator } from '@ygg/shared/user/core';
import { OurboxHeadQuarter } from '../head-quarter';
import { Treasure } from '../treasure';
import { Box } from './box';
import { RelationBoxTreasure } from './box-treasure';

export class BoxFactory {
  constructor(
    protected dataAccessor: DataAccessor,
    protected authenticator: Authenticator,
    protected headquarter: OurboxHeadQuarter,
    protected emcee: Emcee,
    protected locationRecordAccessor: LocationRecordAccessor
  ) {}

  create(data: any = {}): Box {
    const newBox = new Box(
      this.dataAccessor,
      this.authenticator,
      this.headquarter,
      this.emcee,
      this.locationRecordAccessor,
      data
    );
    return newBox;
  }

  async addTreasureToBox(treasure: Treasure, box: Box) {
    try {
      const relaitonBoxTreasure = new RelationBoxTreasure(this.dataAccessor, {
        boxId: box.id,
        treasureId: treasure.id
      });
      await relaitonBoxTreasure.save();
    } catch (error) {
      const wrpErr = wrapError(
        error,
        `Failed to add treasure ${treasure.name} into box ${box.name}`
      );
      return Promise.reject(wrpErr);
    }
  }
}
