import { Emcee, Router, HeadQuarter } from '@ygg/shared/infra/core';
import { wrapError } from '@ygg/shared/infra/error';
import { Album } from '@ygg/shared/omni-types/core';
import { Authenticator } from '@ygg/shared/user/core';
import { isEmpty } from 'lodash';
import { Treasure } from '../treasure';
import { Box } from './box';
import { BoxFactory } from './box-factory';
import { BoxFinder } from './box-finder';
import { GeographyAgent, GeoPoint, Location } from '@ygg/shared/geography/core';
import { Subscription } from 'rxjs';

export class BoxAgent {
  subscription = new Subscription();

  constructor(
    protected emcee: Emcee,
    protected authenticator: Authenticator,
    protected boxFactory: BoxFactory,
    protected boxFinder: BoxFinder,
    protected headquarter: HeadQuarter,
    protected router: Router,
    protected geographyAgent: GeographyAgent
  ) {
    this.headquarter.subscribe('treasure.save.post', treasure =>
      this.onTreasureSave(treasure)
    );
    this.headquarter.subscribe('box.create', () => {
      this.createBox();
    });
    this.headquarter.subscribe('box.showOnMap', (box: Box) => {
      this.showBoxOnMap(box);
    });
  }

  async onTreasureSave(treasure: Treasure) {
    // console.log('On treasure save~!!!');
    // console.dir(treasure);
    try {
      // const boxes = await this.boxFinder.findByTreasure(treasure);
      if (!treasure.boxId) {
        const confirmSelectBox = await this.emcee.confirm(
          `請選擇一個寶箱來存放 ${treasure.name}。<br>沒放進寶箱裡的寶物，別人就找不到它了喔～`
        );
        let selectedBox: Box;
        if (confirmSelectBox) {
          const selectedBoxes = await this.selectMyBoxes({
            title: `請選擇一個寶箱來放置 ${treasure.name}`
          });
          if (!isEmpty(selectedBoxes)) {
            selectedBox = selectedBoxes[0];
          } else {
            selectedBox = null;
          }
        }
        if (selectedBox) {
          //   await this.emcee.info(
          //     `寶物 ${treasure.name} 將會公開，之後若要將寶物移至寶箱中，可至寶物頁面中操作`
          //   );
          // } else {
          await this.addTreasureToBox(treasure, selectedBox);
        }
      } else {
        const box = await this.boxFinder.findById(treasure.boxId);
        await this.boxFactory.addTreasureToBox(treasure, box);
        this.router.navigate(['/', 'box', treasure.boxId]);
      }
    } catch (error) {
      const wrpErr = wrapError(error, `Failed to put treasure into box`);
      await this.emcee.error(wrpErr.message);
      return Promise.reject(wrpErr);
    }
  }

  async selectMyBoxes(options: any = {}): Promise<Box[]> {
    try {
      const title = options.title || '選擇一個寶箱';
      await this.authenticator.requestLogin();
      await this.createMyDefaultBox();

      let result = await this.openMyBoxSelector({ title });
      while (typeof result === 'string' && result === 'create') {
        await this.createBox();
        result = await this.openMyBoxSelector({ title });
      }
      return result as Box[];
    } catch (error) {
      const wrpErr = wrapError(error, `Failed to select my box`);
      return Promise.reject(wrpErr);
    }
  }

  async createBox(): Promise<Box> {
    const promiseCreateBox = new Promise<Box>((resolve, reject) => {
      const subscriptionSaved = this.headquarter.subscribe(
        'box.save.success',
        (box: Box) => {
          subscriptionSaved.unsubscribe();
          resolve(box);
          this.router.navigate(['/', 'box', box.id]);
        }
      );
      const subscriptionSaveFail = this.headquarter.subscribe(
        'box.save.fail',
        () => {
          subscriptionSaved.unsubscribe();
          subscriptionSaveFail.unsubscribe();
          reject('fail');
        }
      );
      const subscriptionEditCancel = this.headquarter.subscribe(
        'box.edit.cancel',
        () => {
          subscriptionSaved.unsubscribe();
          subscriptionSaveFail.unsubscribe();
          subscriptionEditCancel.unsubscribe();
          reject('cancel');
        }
      );
    });
    this.router.navigate(['/', 'box', 'create']);
    return promiseCreateBox;
  }

  async createMyDefaultBox() {
    try {
      const currentUser = await this.authenticator.requestLogin();
      const boxCount = await this.boxFinder.countUserBoxes(currentUser);
      if (boxCount === 0) {
        const defaultBox = await this.boxFactory.create({
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

  async openMyBoxSelector(options: any = {}): Promise<Box[] | string> {
    throw new Error(
      `${this.constructor.name}.openMyBoxSelector not implemented, should be override`
    );
  }

  async addTreasureToBox(treasure: Treasure, box: Box) {
    try {
      await this.boxFactory.addTreasureToBox(treasure, box);
      await this.emcee.info(`寶物 ${treasure.name} 已加入寶箱 ${box.name}`);
      this.headquarter.emit('treasure.addToBox.success', {
        treasure,
        box
      });
      this.router.navigate(['/', 'box', box.id]);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async requireBoxLocation(box: Box) {
    try {
      if (Location.isLocation(box.location)) {
        return box;
      }
      const confirm = await this.emcee.confirm(
        `寶箱 ${box.name} 還沒有設定地點，在地圖上會找不到，現在設定地點？`
      );
      if (confirm) {
        const location = await this.geographyAgent.userInputLocation({
          title: `請輸入寶箱 ${box.name} 的所在地`
        });
        if (Location.isLocation(location)) {
          await box.save();
        }
        return box;
      }
    } catch (error) {
      const wrpErr = wrapError(
        error,
        `Failed to set location of box ${box.name}`
      );
      this.emcee.warning(wrpErr.message);
      return Promise.reject(wrpErr);
    }
  }

  async showBoxOnMap(box: Box) {
    try {
      if (!box.public) {
        throw new Error(`${box.name} 為私人寶箱`);
      }
      const location = box.location;
      if (!location || !GeoPoint.isGeoPoint(location.geoPoint)) {
        throw new Error(`${box.name} 寶箱沒有座標資料`);
      }
      this.router.navigate(['/', 'map'], {
        queryParams: {
          center: location.geoPoint.toCoordsString()
        }
      });
    } catch (error) {
      const wrpErr = wrapError(error, `無法在地圖上顯示寶箱，錯誤原因：`);
      this.emcee.warning(wrpErr.message);
      return Promise.reject();
    }
  }

  popupTreasuresInBox(box: Box) {
    throw new Error('Method not implemented.');
  }
}
