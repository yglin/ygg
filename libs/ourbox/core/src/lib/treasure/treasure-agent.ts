import { Emcee } from '@ygg/shared/infra/core';
import { wrapError } from '@ygg/shared/infra/error';
import { Treasure } from './treasure';

export class TreasureAgent {
  constructor(protected emcee: Emcee) {}

  // async save(treasure: Treasure) {
  //   try {
  //     const currentUser = 
  //     await treasure.save();
  //     if (!treasure.boxId) {
  //       const confirm = await this.emcee.confirm(`請選擇一個寶箱來存放 ${treasure.name}。<br>未放在寶箱內的寶物會完全公開給所有人檢視。`);
  //       if (!confirm) {
  //         return Promise.resolve();
  //       }
  //       const box = await this.boxAgent.selectMyBox();
  //     }
  //   } catch (error) {
  //     const wrpErr = wrapError(error, `儲存寶物失敗，錯誤原因：`);
  //     this.emcee.error(wrpErr.message);
  //     return Promise.reject(wrpErr);
  //   }
  // }
}
