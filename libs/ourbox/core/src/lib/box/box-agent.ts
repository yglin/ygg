import { Emcee } from '@ygg/shared/infra/core';
import { wrapError } from '@ygg/shared/infra/error';
import { Album } from '@ygg/shared/omni-types/core';
import { Authenticator } from '@ygg/shared/user/core';
import { isEmpty } from 'lodash';
import { OurboxHeadQuarter } from '../head-quarter';
import { Treasure } from '../treasure';
import { Box } from './box';
import { BoxFactory } from './box-factory';
import { BoxFinder } from './box-finder';
import { RelationBoxTreasure } from './box-treasure';

export class BoxAgent {
  constructor(
    protected emcee: Emcee,
    protected authenticator: Authenticator,
    protected boxFactory: BoxFactory,
    protected boxFinder: BoxFinder,
    protected headquarter: OurboxHeadQuarter
  ) {
    this.headquarter.registerReaction('treasure.save.post', treasure =>
      this.onTreasureSave(treasure)
    );
  }

  async onTreasureSave(treasure: Treasure) {
    // console.log('On treasure save~!!!');
    // console.dir(treasure);
    try {
      const boxes = await this.boxFinder.findByTreasure(treasure);
      if (isEmpty(boxes)) {
        const confirmSelectBox = await this.emcee.confirm(
          `請選擇一個寶箱來存放 ${treasure.name}。<br>未放在寶箱內的寶物預設為公開檢視。`
        );
        let selectedBox: Box;
        if (confirmSelectBox) {
          selectedBox = await this.selectMyBoxes();
          if (!isEmpty(selectedBox)) {
            selectedBox = selectedBox[0];
          } else {
            selectedBox = null;
          }
        }
        if (!selectedBox) {
          await this.emcee.info(
            `寶物 ${treasure.name} 將會公開，之後若要將寶物移至寶箱中，可至寶物頁面中操作`
          );
        } else {
          await this.addTreasureToBox(treasure, selectedBox);
        }
      }
    } catch (error) {
      const wrpErr = wrapError(error, `Failed to put treasure into box`);
      await this.emcee.error(wrpErr.message);
      return Promise.reject(wrpErr);
    }
  }

  async selectMyBoxes(): Promise<Box> {
    try {
      await this.authenticator.requestLogin();
      await this.createMyDefaultBox();
      const selectedBoxes = await this.openMyBoxSelector();
      return selectedBoxes;
    } catch (error) {
      const wrpErr = wrapError(error, `Failed to select my box`);
      return Promise.reject(wrpErr);
    }
  }

  async createMyDefaultBox() {
    try {
      const currentUser = await this.authenticator.requestLogin();
      const boxCount = await this.boxFinder.countUserBoxes(currentUser);
      if (boxCount === 0) {
        const defaultBox = this.boxFactory.create({
          name: `${currentUser.name}的寶箱`,
          album: new Album({
            cover: { src: Box.thumbnailSrc },
            photos: [{ src: Box.thumbnailSrc }]
          }),
          ownerId: currentUser.id
        });
        await defaultBox.save();
      }
    } catch (error) {
      const wrpErr = wrapError(error, `Failed to create my default box`);
      return Promise.reject(error);
    }
  }

  async openMyBoxSelector(): Promise<Box> {
    throw new Error(
      `${this.constructor.name}.openMyBoxSelector not implemented, should be override`
    );
  }

  async addTreasureToBox(treasure: Treasure, box: Box) {
    try {
      await this.boxFactory.addTreasureToBox(treasure, box);
      await this.emcee.info(`寶物 ${treasure.name} 已加入寶箱 ${box.name}`);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
