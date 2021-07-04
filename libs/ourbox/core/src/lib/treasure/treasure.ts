import {
  DataAccessor,
  Emcee,
  generateID,
  HeadQuarter,
  Query,
  Router,
  toJSONDeep
} from '@ygg/shared/infra/core';
import { wrapError } from '@ygg/shared/infra/error';
import { Album } from '@ygg/shared/omni-types/core';
import { Tags } from '@ygg/shared/tags/core';
import { Authenticator, User } from '@ygg/shared/user/core';
import { extend, get } from 'lodash';
import { ProvisionType, provisionTypes } from './provision-type';

export class Treasure {
  static collection = 'treasures';
  static icon = 'category';
  static provisionTypes = provisionTypes;

  id: string;
  icon: string;
  name: string;
  description: string;
  album: Album;
  provision: ProvisionType;
  tags: Tags;
  // location: Location;
  ownerId: string;
  createAt: Date;
  modifyAt: Date;
  boxId: string;

  constructor(
    protected emcee: Emcee,
    protected router: Router,
    protected authenticator: Authenticator,
    protected dataAccessor: DataAccessor,
    // protected boxAgent: BoxAgent,
    protected headquarter: HeadQuarter,
    options: any = {}
  ) {
    this.id = generateID();
    this.icon = Treasure.icon;
    extend(this, options);
    // if (options.location) {
    //   this.location = new Location().fromJSON(options.location);
    // }
    if (options.album) {
      this.album = new Album().fromJSON(options.album);
    }
    if (options.tags) {
      // console.log(options.tags);
      this.tags = new Tags(options.tags);
    }
    if (options.createAt) {
      this.createAt = new Date(options.createAt);
    }
    if (options.modifyAt) {
      this.modifyAt = new Date(options.modifyAt);
    }
    if (options.provision) {
      this.provision = new ProvisionType(options.provision);
    }
  }

  static queryOwner(owner: User): Query {
    return new Query('ownerId', '==', owner.id);
  }

  static forge(): Treasure {
    const treasure = new Treasure(null, null, null, null, null);
    treasure.album = Album.forge();
    treasure.name = `MyPrecious_${Date.now()}`;
    treasure.tags = Tags.forge();
    treasure.provision = ProvisionType.forge();
    // treasure.location = Location.forge();
    return treasure;
  }

  get image(): string {
    return get(this.album, 'cover.src', '/assets/treasure/treasure.png');
  }

  async inquireData() {
    this.router.navigate(['treasure', 'edit']);
  }

  update(payload: any) {
    extend(this, payload);
  }

  toJSON(): any {
    return toJSONDeep(this);
  }

  async save() {
    try {
      const payload = this.toJSON();
      // console.log(`Save treasure ${this.name}`);
      // console.dir(payload);
      await this.dataAccessor.save(Treasure.collection, this.id, payload);
    } catch (error) {
      const wrpErr = wrapError(error, `Failed to save treasure ${this.name}`);
      this.emcee.error(wrpErr.message);
      return Promise.reject(wrpErr);
    }
  }
}
