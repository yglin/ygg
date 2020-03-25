import { PageObject } from '@ygg/shared/test/page-object';
import { IncomeDataTablePageObject } from '@ygg/shopping/ui';
import { TheThingDataTablePageObject } from '@ygg/the-thing/ui';

export abstract class TourPlanAdminPageObject extends PageObject {
  static TabNames = {
    incomeRecords: '店家廠商收入'
  };

  selectors = {
    main: '.tour-plan-admin',
    selectMonth: 'select.month-select'
  };

  theThingDataTables: { [name: string]: TheThingDataTablePageObject } = {};
  incomeDataTablePO: IncomeDataTablePageObject;

  getSelectorForTabHeader(tabName): string {
    return `${this.getSelector()}  .tab-header[tab-name="${tabName}"]`;
  }

  getSelectorForTabContent(tabName): string {
    return `${this.getSelector()}  .tab-content[tab-name="${tabName}"]`;
  }

  abstract switchToTab(tabName: string): void;
}
