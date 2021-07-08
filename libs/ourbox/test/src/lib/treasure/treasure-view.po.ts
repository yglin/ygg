import { Treasure } from '@ygg/ourbox/core';
import { OmniTypeID, OmniTypes } from '@ygg/shared/omni-types/core';
import {
  AlbumViewPageObjectCypress,
  getViewPageObject
} from '@ygg/shared/omni-types/test';
import { TagsViewPageObjectCypress } from '@ygg/shared/tags/test';
import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { ViewPageObject } from '@ygg/shared/test/page-object';
import { PageTitlePageObjectCypress } from '@ygg/shared/ui/test';
import { get, keys } from 'lodash';

export class TreasureViewPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.ourbox-treasure-view',
    album: '.album',
    tags: '.tags',
    boxLink: '.box-link',
    provisionLabel: '.provision-label',
    price: '.price'
  };

  pageTitlePO: PageTitlePageObjectCypress;
  albumViewPO: AlbumViewPageObjectCypress;
  tagsViewPO: TagsViewPageObjectCypress;

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.pageTitlePO = new PageTitlePageObjectCypress(this.getSelector());
    this.albumViewPO = new AlbumViewPageObjectCypress(
      this.getSelector('album')
    );
    this.tagsViewPO = new TagsViewPageObjectCypress(this.getSelector('tags'));
  }

  expectValue(treasure: Treasure) {
    this.pageTitlePO.expectText(treasure.name);
    this.albumViewPO.expectValue(treasure.album);
    this.tagsViewPO.expectValue(treasure.tags);
    cy.get(this.getSelector('provisionLabel')).should(
      'include.text',
      treasure.provision.label
    );
    if (treasure.provision.isEqual(Treasure.provisionTypes[2])) {
      cy.get(this.getSelector('price')).should('include.text', treasure.price);
    } else {
      cy.get(this.getSelector('price')).should('not.be.visible');
    }
  }

  clickBoxLink() {
    cy.get(this.getSelector('boxLink'))
      .scrollIntoView()
      .click();
  }
}
