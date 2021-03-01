import { Location } from '@ygg/shared/geography/core';
import { DataAccessor, generateID, toJSONDeep } from '@ygg/shared/infra/core';
import { wrapError } from '@ygg/shared/infra/error';
import { Album } from '@ygg/shared/omni-types/core';
import { User } from '@ygg/shared/user/core';
import { extend, get } from 'lodash';
import { Treasure } from '../treasure';

export class Box {
  static collection = 'boxes';
  static thumbnailSrc = '/assets/images/box/box.png';
  static icon = 'inventory';

  id: string;
  name: string;
  ownerId: string;
  album: Album;
  location: Location;

  constructor(protected dataAccessor: DataAccessor, options: any = {}) {
    this.id = generateID();
    extend(this, options);
    if (options && Album.isAlbum(options.album)) {
      this.album = new Album().fromJSON(options.album);
    }
    if (!this.album) {
      this.album = new Album(Box.thumbnailSrc);
    }
  }

  static forge(): Box {
    const forged = new Box(null, null);
    forged.name = `Troll Box ${Date.now()}`;
    forged.album = Album.forge();
    return forged;
  }

  get image(): string {
    return get(this.album, 'cover.src', null);
  }

  async save() {
    try {
      await this.dataAccessor.save(Box.collection, this.id, this.toJSON());
    } catch (error) {
      const wrpErr = wrapError(error, `Failed to save box ${this.name}`);
      return Promise.reject(wrpErr);
    }
  }

  belongsTo(user: User) {
    return this.ownerId === user.id;
  }

  toJSON() {
    return toJSONDeep(this);
  }
}
