import {
  IncomeDataTablePageObject,
  IncomeDataRowPageObject
} from '@ygg/shopping/ui';
import { IncomeRecord, IProductIncomeRecord } from '@ygg/shopping/core';
import { MockDatabase } from '@ygg/shared/test/cypress';
import { TheThing } from '@ygg/the-thing/core';

export class IncomeDataRowPageObjectCypress extends IncomeDataRowPageObject {
  expectValue(value: IncomeRecord) {
    cy.get(this.getSelector('numPurchases')).contains(value.numPurchases);
    cy.get(this.getSelector('totalIncome')).contains(value.totalIncome);
  }
}

export class IncomeDataTablePageObjectCypress extends IncomeDataTablePageObject {
  expectVisible(): Cypress.Chainable<any> {
    return cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }
  expectRecord(incomeRecord: IncomeRecord): void {
    const dataRowPO = new IncomeDataRowPageObjectCypress(
      this.getSelectorForIncomeRecord(incomeRecord)
    );
    dataRowPO.expectValue(incomeRecord);
  }
}
