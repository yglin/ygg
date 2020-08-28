import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { TheThing } from '@ygg/the-thing/core';
import { User } from '@ygg/shared/user/core';
import { UserThumbnailPageObjectCypress } from '@ygg/shared/user/test';
import { TheThingThumbnailPageObjectCypress } from '@ygg/the-thing/test';
import { ImitationItem } from '@ygg/ourbox/core';

export class BoxViewPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.box-view',
    name: '.name',
    image: '.box-image img',
    buttonAddItem: 'button.add-item'
  };

  getSelectorForMember(user: User): string {
    return `${this.getSelector()} .member-list [member-id="${user.id}"]`;
  }

  getSelectorForItem(item: TheThing): string {
    return `${this.getSelector()} .item:contains("${item.name}")`;
  }

  getSelectorForItemInEditing(item: TheThing): string {
    return `${this.getSelector()} .item-editing-list .item:contains("${
      item.name
    }")`;
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

  expectImage(image: string) {
    cy.get(this.getSelector('image')).should('have.attr', 'src', image);
  }

  expectItem(item: TheThing) {
    const theThingThumbnailPO = new TheThingThumbnailPageObjectCypress(
      this.getSelectorForItem(item),
      ImitationItem
    );
    theThingThumbnailPO.expectValue(item);
  }

  gotoItem(item: TheThing) {
    const theThingThumbnailPO = new TheThingThumbnailPageObjectCypress(
      this.getSelectorForItem(item),
      ImitationItem
    );
    theThingThumbnailPO.gotoView();
  }

  expectItemInEditing(item: TheThing) {
    const theThingThumbnailPO = new TheThingThumbnailPageObjectCypress(
      this.getSelectorForItemInEditing(item),
      ImitationItem
    );
    theThingThumbnailPO.expectValue(item);
  }

  gotoCreateItem() {
    cy.get(this.getSelector('buttonAddItem')).click();
  }
}
