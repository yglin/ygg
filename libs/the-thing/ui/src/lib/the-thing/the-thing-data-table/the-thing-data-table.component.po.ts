import { PageObject } from '@ygg/shared/test/page-object';
import { TheThing, TheThingImitation } from '@ygg/the-thing/core';

export abstract class TheThingDataRowPageObject extends PageObject {
  selectors = {
    main: ''
  };

  getSelectorForColumn(columnName): string {
    return `${this.getSelector()} [column-name="${columnName}"]`;
  }

  abstract expectValue(value: TheThing): void;
}

export abstract class TheThingDataTablePageObject extends PageObject {
  selectors = {
    main: '.the-thing-data-table',
    inputSearch: '.search input',
    checkboxSelectAll: '.toggle-select-all label input[type="checkbox"]'
  };

  getSelectorForFirst(): string {
    return `${this.getSelector()} tr.first`;
  }

  getSelectorForTheThing(theThing: TheThing): string {
    return `${this.getSelector()} tr:contains("${theThing.name}")`;
  }

  abstract expectVisible(): void;
  abstract expectTheThing(
    theThing: TheThing,
    imitation?: TheThingImitation
  ): void;
  abstract gotoTheThingView(theThing: TheThing): void;
  abstract gotoTheThingEdit(theThing: TheThing): void;
  abstract expectNotTheThing(theThings: TheThing | TheThing[]): void;
  abstract expectNotEmpty(): void;
  abstract expectEmpty(): void;
  // abstract deleteTheThing(theThing: TheThing): void;
  abstract select(theThings: TheThing[]): void;
  abstract selectAll(): void;
}
