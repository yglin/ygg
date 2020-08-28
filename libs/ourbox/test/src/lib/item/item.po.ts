import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { TheThingPageObjectCypress } from '@ygg/the-thing/test';
import { ImitationItem } from '@ygg/ourbox/core';
import { TheThing } from '@ygg/the-thing/core';
import { defaults } from 'lodash';
import { EmceePageObjectCypress } from '@ygg/shared/ui/test';
import { User } from '@ygg/shared/user/core';
import { UserThumbnailPageObjectCypress } from '@ygg/shared/user/test';

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
    const confirmMessage = `順便開放寶物 ${item.name} 讓人索取嗎？開放後資料無法修改喔`;
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
}
