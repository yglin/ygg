import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingDataTablePageObject, MyThingsDataTablePageObject } from '@ygg/the-thing/ui';

export abstract class MyPlayListPageObject extends PageObject {
  selectors = {
    main: '.my-play-list',
    buttonCreate: 'button.create',
    dataTable: '.data-table'
  };
  myPlaysDataTablePO: MyThingsDataTablePageObject;

  abstract clickCreate(): void;

  deletePlay(play: TheThing) {
    this.myPlaysDataTablePO.deleteSelection([play]);
  }

  expectPlay(play: TheThing) {
    this.myPlaysDataTablePO.theThingDataTablePO.expectTheThing(play);
  }

  expectNotPlay(play: TheThing) {
    this.myPlaysDataTablePO.theThingDataTablePO.expectNotTheThing(play);
  }

  clickPlay(play: TheThing) {
    this.myPlaysDataTablePO.theThingDataTablePO.gotoTheThingView(play);
  }
}
