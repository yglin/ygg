import {
  DataAccessor,
  Emcee,
  generateID,
  Query,
  Router,
  toJSONDeep
} from '@ygg/shared/infra/core';
import { wrapError } from '@ygg/shared/infra/error';
import { Album } from '@ygg/shared/omni-types/core';
import { Tags } from '@ygg/shared/tags/core';
import { Authenticator, User } from '@ygg/shared/user/core';
import { extend, get } from 'lodash';
import { OurboxHeadQuarter } from '../head-quarter';

export class Treasure {
  static collection = 'treasures';
  static icon = 'category';

  id: string;
  icon: string;
  name: string;
  description: string;
  album: Album;
  tags: Tags;
  // location: Location;
  ownerId: string;
  createAt: Date;
  modifyAt: Date;

  constructor(
    protected emcee: Emcee,
    protected router: Router,
    protected authenticator: Authenticator,
    protected dataAccessor: DataAccessor,
    // protected boxAgent: BoxAgent,
    protected headquarter: OurboxHeadQuarter,
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
  }

  static queryOwner(owner: User): Query {
    return new Query('ownerId', '==', owner.id);
  }

  static forge(): Treasure {
    const treasure = new Treasure(null, null, null, null, null);
    treasure.album = Album.forge();
    treasure.name = `MyPrecious_${Date.now()}`;
    treasure.tags = Tags.forge();
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
      let actionName;
      if (!this.createAt) {
        this.createAt = new Date();
        actionName = `新增`;
      } else {
        this.modifyAt = new Date();
        actionName = `更新`;
      }
      const currentUser = await this.authenticator.requestLogin({
        message: `${actionName}寶物前請先登入帳號`
      });
      if (!this.ownerId) {
        this.ownerId = currentUser.id;
      } else if (this.ownerId !== currentUser.id) {
        throw new Error(`抱歉，你不是 ${this.name} 的所有者`);
      }
      const payload = this.toJSON();
      // console.log(`Save treasure ${this.name}`);
      // console.dir(payload);
      await this.dataAccessor.save(Treasure.collection, this.id, payload);
      await this.emcee.info(`成功${actionName}寶物 ${this.name} ！`);
      this.headquarter.emit('treasure.save.post', this);
    } catch (error) {
      const wrpErr = wrapError(error, `儲存寶物失敗，錯誤原因：`);
      this.emcee.error(wrpErr.message);
      return Promise.reject(wrpErr);
    }
  }
}
