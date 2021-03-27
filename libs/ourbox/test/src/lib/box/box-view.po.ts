import { Box } from '@ygg/ourbox/core';
import { Location } from '@ygg/shared/geography/core';
import { LocationViewPageObjectCypress } from '@ygg/shared/geography/test';
import { Album } from '@ygg/shared/omni-types/core';
import { AlbumViewPageObjectCypress } from '@ygg/shared/omni-types/test';
import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { PageTitlePageObjectCypress } from '@ygg/shared/ui/test';

export class BoxViewPageObjectCypress extends PageObjectCypress {
  pageTitlePO: PageTitlePageObjectCypress;
  albumViewPO: AlbumViewPageObjectCypress;
  locationPO: LocationViewPageObjectCypress;

  selectors = {
    main: '.box-view',
    public: '.publicity',
  };

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.pageTitlePO = new PageTitlePageObjectCypress(this.getSelector());
    this.albumViewPO = new AlbumViewPageObjectCypress(this.getSelector());
    this.locationPO = new LocationViewPageObjectCypress(this.getSelector());
  }

  // getSelectorForMember(user: User): string {
  //   return `${this.getSelector()} .member-list [member-id="${user.id}"]`;
  // }

  // getSelectorForItem(item: TheThing): string {
  //   return `${this.getSelector()} .item:contains("${item.name}")`;
  // }

  // getSelectorForItemAvailable(item: TheThing): string {
  //   return `${this.getSelector()} .item-available-list .item:contains("${
  //     item.name
  //   }")`;
  // }

  // getSelectorForItemInEditing(item: TheThing): string {
  //   return `${this.getSelector()} .item-editing-list .item:contains("${
  //     item.name
  //   }")`;
  // }

  expectName(name: string) {
    this.pageTitlePO.expectText(name);
  }

  expectAlbum(album: Album) {
    this.albumViewPO.expectValue(album);
  }

  expectLocation(location: Location) {
    this.locationPO.expectValue(location);
  }

  expectPublicity(isPublic: boolean) {
    const text = isPublic ? '公開寶箱' : '私人寶箱';
    cy.get(this.getSelector('public')).should('include.text', text);
  }

  expectValue(box: Box) {
    this.expectName(box.name);
    this.expectAlbum(box.album);
    this.expectLocation(box.location);
    this.expectPublicity(box.public);
  }

  // expectMember(user: User) {
  //   const userThumbnailPO = new UserThumbnailPageObjectCypress(
  //     this.getSelectorForMember(user)
  //   );
  //   userThumbnailPO.expectVisible();
  // }

  // expectItem(item: TheThing) {
  //   const theThingThumbnailPO = new TheThingThumbnailPageObjectCypress(
  //     this.getSelectorForItem(item),
  //     ImitationItem
  //   );
  //   theThingThumbnailPO.expectValue(item);
  // }

  // gotoItem(item: TheThing) {
  //   const theThingThumbnailPO = new TheThingThumbnailPageObjectCypress(
  //     this.getSelectorForItem(item),
  //     ImitationItem
  //   );
  //   theThingThumbnailPO.gotoView();
  // }

  // expectItemAvailable(item: TheThing) {
  //   const theThingThumbnailPO = new TheThingThumbnailPageObjectCypress(
  //     this.getSelectorForItemAvailable(item),
  //     ImitationItem
  //   );
  //   theThingThumbnailPO.expectValue(item);
  // }

  // expectItemInEditing(item: TheThing) {
  //   const theThingThumbnailPO = new TheThingThumbnailPageObjectCypress(
  //     this.getSelectorForItemInEditing(item),
  //     ImitationItem
  //   );
  //   theThingThumbnailPO.expectValue(item);
  // }

  // gotoCreateItem() {
  //   cy.get(this.getSelector('buttonAddItem')).click();
  // }

  // expectCreateItemHint() {
  //   cy.get(this.getSelector('createItemHint')).should(
  //     'include.text',
  //     `寶箱中還沒有任何寶物，新增寶物？`
  //   );
  //   cy.get(this.getSelector('createItemHint'))
  //     .find('button.create-item')
  //     .should('be.visible');
  // }

  // expectNoCreateItemHint() {
  //   cy.get(this.getSelector('createItemHint')).should('not.exist');
  // }
}
