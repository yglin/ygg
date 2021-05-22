import {
  DataAccessor,
  Emcee,
  HeadQuarter,
  Router
} from '@ygg/shared/infra/core';
import { wrapError } from '@ygg/shared/infra/error';
import { Authenticator } from '@ygg/shared/user/core';
import { Treasure } from './treasure';

export class TreasureFactory {
  cache: { [id: string]: Treasure } = {};

  constructor(
    protected emcee: Emcee,
    protected router: Router,
    protected authenticator: Authenticator,
    protected dataAccessor: DataAccessor,
    protected headquarter: HeadQuarter
  ) {}

  create(data: any = {}): Treasure {
    if (data && data.id && data.id in this.cache) {
      return this.cache[data.id];
    } else {
      const treasure = new Treasure(
        this.emcee,
        this.router,
        this.authenticator,
        this.dataAccessor,
        this.headquarter,
        data
      );
      this.cache[treasure.id] = treasure;
      return treasure;
    }
  }

  async save(treasure: Treasure) {
    try {
      let actionName;
      if (!treasure.createAt) {
        treasure.createAt = new Date();
        actionName = `新增`;
      } else {
        treasure.modifyAt = new Date();
        actionName = `更新`;
      }
      const currentUser = await this.authenticator.requestLogin({
        message: `${actionName}寶物前請先登入帳號`
      });
      if (!treasure.ownerId) {
        treasure.ownerId = currentUser.id;
      } else if (treasure.ownerId !== currentUser.id) {
        throw new Error(`抱歉，你不是 ${treasure.name} 的所有者`);
      }
      await treasure.save();
      await this.emcee.info(`成功${actionName}寶物 ${treasure.name} ！`);
      this.headquarter.emit('treasure.save.post', treasure);
    } catch (error) {
      const wrpErr = wrapError(error, `儲存寶物失敗，錯誤原因：`);
      this.emcee.error(wrpErr.message);
      return Promise.reject(wrpErr);
    }
  }
}
