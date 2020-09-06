import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { TheThing, TheThingImitation } from '@ygg/the-thing/core';
import { TheThingFilterPageObjectCypress } from './the-thing-filter.po';

export class TheThingFinderPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.the-thing-finder',
    filter: '.filter',
    inputSearchName: '.search-name input',
    theThingList: '.the-thing-list',
    buttonSubmit: 'button.submit'
  };

  imitation: TheThingImitation;
  theThingFilterPO: TheThingFilterPageObjectCypress;

  constructor(parentSelector: string, imitation: TheThingImitation) {
    super(parentSelector);
    this.theThingFilterPO = new TheThingFilterPageObjectCypress(
      this.getSelector('filter')
    );
    this.imitation = imitation;
  }

  getSelectorForTheThing(theThing: TheThing): string {
    return `${this.getSelector()} [the-thing-name="${theThing.name}"]`;
  }

  expectNotTheThing(theThing: TheThing) {
    this.theThingFilterPO.searchName(theThing.name);
    cy.get(this.getSelectorForTheThing(theThing)).should('not.exist');
  }

  expectTheThing(theThing: TheThing) {
    this.theThingFilterPO.searchName(theThing.name);
    cy.get(this.getSelectorForTheThing(theThing)).should('be.visible');
  }

  // find(theThing: TheThing) {
  //   const chipsControlPO = new ChipsControlPageObjectCypress(
  //     this.getSelector('tagsFilter')
  //   );
  //   chipsControlPO.setValue(theThing.tags.toNameArray());
  //   cy.get(this.getSelector('inputSearchName'))
  //     .clear({ force: true })
  //     .type(theThing.name);
  //   // cy.pause();
  //   this.imageThumbnailList.expectTheThing(theThing);
  // }

  // selectTheThings(things: TheThing[]) {
  //   this.imageThumbnailList.selectTheThings(things);
  // }
  // submit() {
  //   cy.get(this.getSelector('buttonSubmit')).click({ force: true });
  // }
}
