import { TheThingFilterPageObject } from '@ygg/the-thing/ui';
import { ChipsControlPageObjectCypress } from '@ygg/shared/test/cypress';

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
}
