import { Treasure } from '@ygg/ourbox/core';
import { OmniTypeID, OmniTypes } from '@ygg/shared/omni-types/core';
import { getViewPageObject } from '@ygg/shared/omni-types/test';
import { PageObjectCypress } from '@ygg/shared/test/cypress';
import { ViewPageObject } from '@ygg/shared/test/page-object';
import { PageTitlePageObjectCypress } from '@ygg/shared/ui/test';
import { get, keys } from 'lodash';

export class TreasureViewPageObjectCypress extends PageObjectCypress {
  selectors = {
    main: '.ourbox-treasure-view'
  };

  pageTitlePO: PageTitlePageObjectCypress;

  fields: {
    [name: string]: {
      selector: string;
      type: OmniTypeID;
      pageObject?: ViewPageObject;
    };
  } = {
    album: {
      selector: '.album',
      type: OmniTypes.album.id
    },
    location: {
      selector: '.location',
      type: OmniTypes.location.id
    }
  };

  constructor(parentSelector?: string) {
    super(parentSelector);
    this.pageTitlePO = new PageTitlePageObjectCypress(this.getSelector());
    for (const key in this.fields) {
      if (Object.prototype.hasOwnProperty.call(this.fields, key)) {
        const field = this.fields[key];
        field.pageObject = getViewPageObject(
          field.type,
          `${this.getSelector()} ${field.selector}`
        );
      }
    }
  }

  expectValue(treasure: Treasure) {
    this.pageTitlePO.expectText(treasure.name);
    cy.wrap(keys(this.fields)).each((fieldName: string) => {
      const field = this.fields[fieldName];
      field.pageObject.expectValue(treasure[fieldName]);
    });
  }
}
