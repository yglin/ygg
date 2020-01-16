import { TheThingFilterPageObject } from '@ygg/the-thing/ui';
import { ChipsControlPageObjectCypress } from '@ygg/shared/test/cypress';
import { TheThingFilter } from '@ygg/the-thing/core';

export class TheThingFilterPageObjectCypress extends TheThingFilterPageObject {
  chipControlPO: ChipsControlPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.chipControlPO = new ChipsControlPageObjectCypress(this.getSelector());
  }

  clear() {
    this.chipControlPO.clear();
    cy.get(this.getSelector('inputSearchName')).clear({ force: true });
  }

  setTags(tags: string[]) {
    this.chipControlPO.setValue(tags);
  }

  searchName(keyword: string) {
    cy.get(this.getSelector('inputSearchName'))
      .clear({ force: true })
      .type(keyword);
  }

  setFilter(filter: TheThingFilter) {
    this.setTags(filter.tags);
    this.searchName(filter.keywordName);
  }

  saveFilter(name: string) {
    const stub = cy.stub();
    cy.on('window:alert', stub);
    cy.get(this.getSelector('inputFilterName'))
      .clear({ force: true })
      .type(name);
    cy.get(this.getSelector('buttonSave'))
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith('儲存成功');
      });
  }

  loadFilter(name: string) {
    cy.get(this.getSelector('inputFilterName'))
      .clear({ force: true })
      .type(name);
    cy.get(this.getSelector('buttonLoad')).click();
  }
}
