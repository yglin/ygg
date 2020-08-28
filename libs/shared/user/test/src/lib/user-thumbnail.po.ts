import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { User } from '@ygg/shared/user/core';

export class UserThumbnailPageObjectCypress extends PageObjectCypress {
  selectors = {
    main:'.ygg-user-thumbnail',
    name: '.name'
  };

  expectUser(user: User) {
    cy.get(this.getSelector('name')).should('include.text', user.name);
    if (user.avatarUrl) {
      cy.get(this.getSelector('avatar')).should('have.attr', 'src', user.avatarUrl);
    }
  }
}