import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { TheThing } from '@ygg/the-thing/core';
import { User } from '@ygg/shared/user/core';
import { UserThumbnailPageObjectCypress } from '@ygg/shared/user/test';

export class BoxViewPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.box-view',
    name: '.name'
  };

  getSelectorForMember(user: User): string {
    return `${this.getSelector()} .member-list [member-id="${user.id}"]`;
  }

  expectName(name: string) {
    cy.get(this.getSelector('name')).should('include.text', name);
  }

  expectValue(box: TheThing) {
    this.expectName(box.name);
  }

  expectMember(user: User) {
    const userThumbnailPO = new UserThumbnailPageObjectCypress(
      this.getSelectorForMember(user)
    );
    userThumbnailPO.expectVisible();
  }
}
