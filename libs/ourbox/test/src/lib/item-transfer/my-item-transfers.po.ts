import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { TheThing } from '@ygg/the-thing/core';
import { TheThingDataTablePageObjectCypress } from '@ygg/the-thing/test';
import { ImitationItemTransfer } from '@ygg/ourbox/core';

export class MyItemTransfersPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.my-item-transfers',
    dataTable: '.data-table'
  };

  theThingDataTablePO: TheThingDataTablePageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.theThingDataTablePO = new TheThingDataTablePageObjectCypress(
      this.getSelector('dataTable'),
      ImitationItemTransfer
    );
  }

  expectItemTransfer(itemTransfer: TheThing) {
    this.theThingDataTablePO.expectTheThing(itemTransfer);
  }

  gotoItemTransfer(itemTransfer: TheThing) {
    this.theThingDataTablePO.gotoTheThingView(itemTransfer);
  }
}
