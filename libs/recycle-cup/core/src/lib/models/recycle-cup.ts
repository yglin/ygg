import { DataAccessor, Emcee } from '@ygg/shared/infra/core';
import { wrapError } from '@ygg/shared/infra/error';
import { Album } from '@ygg/shared/omni-types/core';
import { extend } from 'lodash';
import * as hash from 'object-hash';

export class RecycleCup {
  static collection: string;

  ownerId: string;
  capacity: number;
  material: 'PP' | 'PE' | 'Styrofoam';
  album: Album;

  constructor(protected dataAccessor: DataAccessor, protected emcee: Emcee) {}

  extend(data: any) {
    extend(this, data);
  }

  async save() {
    try {
      const data = JSON.parse(JSON.stringify(this));
      const id = hash(data);
      this.dataAccessor.save(RecycleCup.collection, id, data);
    } catch (error) {
      const wError = wrapError(error, 'Failed to save RecycleCup');
      this.emcee.error(wError.message);
      return Promise.reject(wError);
    }
  }
}
