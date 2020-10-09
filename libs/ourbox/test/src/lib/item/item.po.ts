import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { TheThingPageObjectCypress } from '@ygg/the-thing/test';
import { ImitationItem, messages } from '@ygg/ourbox/core';
import { TheThing } from '@ygg/the-thing/core';
import { defaults } from 'lodash';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';
import { User } from '@ygg/shared/user/core';
import { UserThumbnailPageObjectCypress } from '@ygg/shared/user/test';
import { Tags } from '@ygg/tags/core';

export class ItemPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.ourbox-item',
    holder: '.holder',
    requesterList: '.requester-list'
  };
  theThingPO: TheThingPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.theThingPO = new TheThingPageObjectCypress(
      this.getSelector(),
      ImitationItem
    );
  }

  getSelectorForRequesterAt(place: number): string {
    return `${this.getSelector('requesterList')} .requester[place="${place}"]`;
  }

  createItem(
    item: TheThing,
    options: {
      makeAvailable?: boolean;
    } = {}
  ) {
    options = defaults(options, {
      makeAvailable: false
    });
    this.theThingPO.setValue(item);
    this.theThingPO.save(item);
    const emceePO = new EmceePageObjectCypress();
    const confirmMessage = `順便開放寶物 ${item.name} 讓人索取嗎？<br>${messages.itemAvailableNote}`;
    if (options.makeAvailable) {
      emceePO.confirm(confirmMessage);
    } else {
      emceePO.cancel(confirmMessage);
    }
  }

  expectItem(item: TheThing) {
    this.theThingPO.expectValue(item);
  }

  expectHolder(holder: User) {
    const userThumbnailPO = new UserThumbnailPageObjectCypress(
      this.getSelector('holder')
    );
    userThumbnailPO.expectUser(holder);
  }

  expectNoRequester() {
    cy.get(this.getSelector('requesterList'))
      .find('.requester')
      .should('have.length', 0);
  }

  expectRequester(requester: User, place: number) {
    const userThumbnailPO = new UserThumbnailPageObjectCypress(
      this.getSelectorForRequesterAt(place)
    );
    userThumbnailPO.expectUser(requester);
  }

  expectNotRequester(requester: User) {
    cy.get(this.getSelector('requesterList'))
      .find(`.requester:contains("${requester.name}")`)
      .should('have.length', 0);
  }

  publishAvailable(item: TheThing) {
    this.theThingPO.runAction(ImitationItem.actions['publish-available']);
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(`開放寶物 ${item.name} 讓人索取嗎？<br>${messages.itemAvailableNote}`);
    emceePO.alert(`寶物 ${item.name} 已開放讓人索取`);
  }
}
