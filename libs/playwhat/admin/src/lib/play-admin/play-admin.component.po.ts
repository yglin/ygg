import { PageObject } from '@ygg/shared/test/page-object';
import { TheThingDataTablePageObject } from '@ygg/the-thing/ui';

export abstract class PlayAdminPageObject extends PageObject {
  selectors = {
    main: '.play-admin'
  };

  theThingDataTables: { [name: string]: TheThingDataTablePageObject } = {};

  getSelectorForTabHeader(tabName): string {
    return `${this.getSelector()}  .tab-header[tab-name="${tabName}"]`;
  }

  getSelectorForTabContent(tabName): string {
    return `${this.getSelector()}  .tab-content[tab-name="${tabName}"]`;
  }

  abstract switchToTab(tabName: string): void;
}
