import {
  TheThingDataTablePageObject,
  TheThingDataRowPageObject
} from '@ygg/the-thing/ui';
import {
  TheThing,
  TheThingImitation,
  DataTableColumnConfig
} from '@ygg/the-thing/core';
import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { timeout } from 'rxjs/operators';
import { values, keys, get } from 'lodash';
import { TheThingCellViewPageObjectCypress } from '../cell/cell-view.po';
import { OmniTypeViewPageObjectCypress } from '@ygg/shared/omni-types/test';
import { UserThumbnailPageObjectCypress } from '@ygg/shared/user/test';

export class TheThingDataRowPageObjectCypress extends TheThingDataRowPageObject {
  imitation: TheThingImitation;

  constructor(
    parentSelector: string = '',
    imitation: TheThingImitation = null
  ) {
    super(parentSelector);
    this.imitation = imitation;
  }

  expectValue(theThing: TheThing) {
    cy.get(this.getSelectorForColumn('name')).contains(theThing.name);
    if (this.imitation) {
      const columnConfigs = this.imitation.dataTableConfig.columns;
      cy.wrap(keys(columnConfigs)).each((key: any) => {
        const columnConfig = columnConfigs[key] as DataTableColumnConfig;
        switch (columnConfig.valueSource) {
          case 'function':
            const value = columnConfig.value(theThing);
            cy.get(this.getSelectorForColumn(key)).contains(value.toString());
            break;
          case 'cell':
            const cell = theThing.getCell(key);
            const cellViewPO = new OmniTypeViewPageObjectCypress(
              this.getSelectorForColumn(key)
            );
            cellViewPO.expectValue(cell.type, cell.value);
            break;
          case 'meta':
            const metaValue = get(theThing, key, null);
            cy.get(this.getSelectorForColumn(key)).contains(
              JSON.stringify(metaValue)
            );
            break;
          case 'users':
            const userIds = theThing.listUserIdsOfRole(columnConfig.value);
            cy.wrap(userIds).each(userId => {
              const userThumbnail = new UserThumbnailPageObjectCypress(
                `${this.getSelectorForColumn(key)} [user-id="${userId}"]`
              );
              userThumbnail.expectVisible();
            });
            break;
          default:
            throw new Error(
              `Unsupported DataTableColumnConfig.valueSource: ${columnConfig.valueSource}`
            );
        }
      });
    }
  }
}

export class TheThingDataTablePageObjectCypress
  extends TheThingDataTablePageObject {
  constructor(parentSelector: string = '', imitation: TheThingImitation) {
    super(parentSelector);
    this.imitation = imitation;
  }

  expectVisible(): Cypress.Chainable<any> {
    return cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  setSearchText(text: string) {
    cy.get(this.getSelector('inputSearch'))
      .clear()
      .type(text);
  }

  expectTheThing(theThing: TheThing) {
    this.setSearchText(theThing.name);
    const theThingDataRowPO = new TheThingDataRowPageObjectCypress(
      this.getSelectorForTheThing(theThing),
      this.imitation
    );
    theThingDataRowPO.expectValue(theThing);
  }

  expectNotTheThing(theThing: TheThing) {
    this.setSearchText(theThing.name);
    cy.get(this.getSelectorForTheThing(theThing)).should('not.exist');
  }

  expectNotEmpty() {
    cy.get(`${this.getSelector()} .row`, { timeout: 10000 }).should('exist');
  }

  expectEmpty() {
    cy.get(`${this.getSelector()} .row`, { timeout: 10000 }).should(
      'not.exist'
    );
  }

  deleteTheThing(theThing: TheThing) {
    this.setSearchText(theThing.name);
    cy.get(`${this.getSelector()}`)
      .contains('tr', theThing.name)
      .find('button.delete')
      .click();
  }

  gotoTheThingView(theThing: TheThing) {
    this.setSearchText(theThing.name);
    cy.get(this.getSelectorForTheThing(theThing)).click();
  }

  gotoTheThingEdit(theThing: TheThing) {
    cy.get(this.getSelector())
      .contains('tr.row', theThing.name)
      .find('button.edit')
      .click();
  }

  expectFirst(theThing: TheThing) {
    cy.get(this.getSelectorForFirst()).contains(theThing.name);
  }

  clickFirst() {
    cy.get(this.getSelectorForFirst()).click();
  }

  select(theThings: TheThing[]) {
    cy.wrap(theThings).each((thing: any) => {
      this.setSearchText(thing.name);
      cy.get(`${this.getSelector()}`)
        .contains('tr.row', thing.name)
        .find('input[type="checkbox"]')
        .click({
          force: true,
          multiple: true
        });
    });
  }

  selectAll() {
    cy.get(this.getSelector('checkboxSelectAll'))
      .check({ force: true })
      .should('be.checked');
  }
}
