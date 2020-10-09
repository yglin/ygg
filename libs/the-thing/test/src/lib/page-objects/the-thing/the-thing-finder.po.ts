import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { Tags } from '@ygg/tags/core';
import { TagsControlPageObjectCypress } from '@ygg/tags/test';
import { TheThing, TheThingImitation } from '@ygg/the-thing/core';
import { defaults } from 'lodash';
import { TheThingFilterPageObjectCypress } from './the-thing-filter.po';

export class TheThingFinderPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.the-thing-finder',
    filter: '.filter',
    inputSearchName: '.search-name input',
    theThingList: '.the-thing-list',
    buttonSubmit: 'button.submit',
    tagsContorl: '.tags-control'
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

  setFilterTags(tags: string[]) {
    this.theThingFilterPO.setTags(tags);
  }

  getSelectorForTheThing(theThing: TheThing): string {
    return `${this.getSelector()} [the-thing-name="${theThing.name}"]`;
  }

  searchName(name: string) {
    this.theThingFilterPO.searchName(name);
  }

  expectNotTheThing(theThing: TheThing) {
    // this.searchName(theThing.name);
    cy.get(this.getSelectorForTheThing(theThing)).should('not.exist');
  }

  expectTheThing(theThing: TheThing) {
    // this.theThingFilterPO.searchName(name);
    cy.get(this.getSelectorForTheThing(theThing))
      .scrollIntoView()
      .should('be.visible');
    // this.theThingFilterPO.searchName('');
  }

  expectTheThings(things: TheThing[], options: { exact?: boolean } = {}) {
    options = defaults(options, { exact: false });
    if (options.exact) {
      cy.get(`${this.getSelector()} [the-thing-name]`).should(
        'have.length',
        things.length
      );
    }
    cy.wrap(things).each((thing: TheThing) => this.expectTheThing(thing));
  }

  // find(theThing: TheThing) {
  //   const chipsControlPO = new ChipsControlPageObjectCypress(
  //     this.getSelector('tagsFilter')
  //   );
  //   chipsControlPO.setValue(theThing.tags.tags);
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
