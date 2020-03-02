import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingDataTablePageObject } from '@ygg/the-thing/ui';

export abstract class MyPlayListPageObject extends PageObject {
  selectors = {
    main: '.my-play-list',
    buttonCreate: 'button.create',
    dataTable: '.data-table'
  };
  theThingDataTablePO: TheThingDataTablePageObject;
  abstract clickCreate(): void;
  
  deletePlay(play: TheThing) {
    this.theThingDataTablePO.deleteTheThing(play);
  }
  
  expectPlay(play: TheThing) {
    this.theThingDataTablePO.expectTheThing(play);
  }

  expectNotPlay(play: TheThing) {
    this.theThingDataTablePO.expectNotTheThing(play);
  }
}
