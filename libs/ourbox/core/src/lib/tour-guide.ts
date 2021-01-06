import { Emcee, Router } from '@ygg/shared/infra/core';
import { Box } from './box';
import { MapViewer } from './map';
import { Treasure, TreasureFactory } from './treasure';

export class OurboxTourGuide {
  treasureFactory: TreasureFactory;
  mapViewer: MapViewer;

  constructor(protected emcee: Emcee, protected router: Router) {
    this.treasureFactory = new TreasureFactory(router);
    this.mapViewer = new MapViewer();
  }

  async createTreasure() {
    try {
      const treasure: Treasure = await this.treasureFactory.create();
      if (!treasure) {
        return Promise.reject();
      }
      await treasure.inquireData();
      // await this.emcee.info(`寶物必須放在寶箱中，請選擇一個寶箱儲放。`);
      // const box: Box = await this.selectBox();
      // await box.addTreasure(treasure);
      // await this.mapViewer.panToLocation(treasure.location);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async selectBox(): Promise<Box> {
    return Promise.reject();
  }
}
