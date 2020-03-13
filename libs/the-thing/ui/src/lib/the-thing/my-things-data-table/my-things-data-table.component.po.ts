import { PageObject } from '@ygg/shared/test/page-object';
import { TheThingDataTablePageObject } from '../the-thing-data-table/the-thing-data-table.component.po';
import { TheThing } from '@ygg/the-thing/core';

export abstract class MyThingsDataTablePageObject extends PageObject {
  selectors = {
    main: '.my-things-data-table',
    buttonCreate: 'button.create',
    buttonDeleteSelection: 'button.delete-selection'
  };
  theThingDataTablePO: TheThingDataTablePageObject;

  abstract clickCreate(): void;
  abstract deleteAll(): void;
  abstract deleteSelection(theThings: TheThing[]): void;
}
