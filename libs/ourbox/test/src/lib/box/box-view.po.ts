import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { TheThing } from '@ygg/the-thing/core';
import { User } from '@ygg/shared/user/core';
import { UserThumbnailPageObjectCypress } from '@ygg/shared/user/test';
import {
  TheThingThumbnailPageObjectCypress,
  TheThingPageObjectCypress
} from '@ygg/the-thing/test';
import { ImitationItem, ImitationBox } from '@ygg/ourbox/core';

export class BoxViewPageObjectCypress extends PageObjectCypress {
  theThingPO: TheThingPageObjectCypress;

  selectors = {
    main: '.box-view',
    name: '.name',
    image: '.box-image img',
    buttonAddItem: 'button.add-item',
    createItemHint: '.create-item-hint'
  };

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.theThingPO = new TheThingPageObjectCypress(
      this.getSelector(),
      ImitationBox
    );
  }

  getSelectorForMember(user: User): string {
    return `${this.getSelector()} .member-list [member-id="${user.id}"]`;
  }

  getSelectorForItem(item: TheThing): string {
    return `${this.getSelector()} .item:contains("${item.name}")`;
  }

  getSelectorForItemAvailable(item: TheThing): string {
    return `${this.getSelector()} .item-available-list .item:contains("${
      item.name
    }")`;
  }

  getSelectorForItemInEditing(item: TheThing): string {
    return `${this.getSelector()} .item-editing-list .item:contains("${
      item.name
    }")`;
  }

  expectName(name: string) {
    this.theThingPO.expectName(name);
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
    this.theThingPO.expectImage(image);
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

  expectItemAvailable(item: TheThing) {
    const theThingThumbnailPO = new TheThingThumbnailPageObjectCypress(
      this.getSelectorForItemAvailable(item),
      ImitationItem
    );
    theThingThumbnailPO.expectValue(item);
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

  expectCreateItemHint() {
    cy.get(this.getSelector('createItemHint')).should(
      'include.text',
      `寶箱中還沒有任何寶物，新增寶物？`
    );
    cy.get(this.getSelector('createItemHint'))
      .find('button.create-item')
      .should('be.visible');
  }

  expectNoCreateItemHint() {
    cy.get(this.getSelector('createItemHint')).should('not.be.visible');
  }
}
