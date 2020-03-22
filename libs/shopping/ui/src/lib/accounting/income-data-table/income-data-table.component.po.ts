import { PageObject } from '@ygg/shared/test/page-object';
import { IncomeRecord } from '@ygg/shopping/core';

export abstract class IncomeDataRowPageObject extends PageObject {
  selectors = {
    main: '',
    numPurchases: '.num-purchases',
    totalIncome: '.total-income'
  };

  abstract expectValue(value: IncomeRecord): void;
}

export abstract class IncomeDataTablePageObject extends PageObject {
  selectors = {
    main: '.income-data-table'
  };

  getSelectorForIncomeRecord(incomeRecord: IncomeRecord): string {
    return `${this.getSelector()} [producer-id="${incomeRecord.producerId}"]`;
  }

  abstract expectVisible(): void;
  abstract expectRecord(incomeRecord: IncomeRecord): void;
}
