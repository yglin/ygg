import { values } from 'lodash';
import { TheThing, TheThingCell } from '@ygg/the-thing/core';
import { TheThingViewPageObject } from '@ygg/the-thing/ui';
import {
  AlbumViewPageObjectCypress,
  AddressViewPageObjectCypress
} from '@ygg/shared/omni-types/test';
import { HtmlViewPageObjectCypress } from '@ygg/shared/omni-types/test';
import { TheThingListPageObjectCypress } from './the-thing-list.po';
import { User } from '@ygg/shared/user';
import { ImageThumbnailListPageObjectCypress } from '@ygg/shared/ui/test';

class Relation {
  name: string;
  description: string;
  subjectId: string;
  objectId: string;
}

export class TheThingViewPageObjectCypress extends TheThingViewPageObject {
  expectVisible() {
    cy.get(this.getSelector(), { timeout: 20000 }).should('be.visible');
  }

  expectCell(cell: TheThingCell) {
    switch (cell.type) {
      case 'text':
        cy.get(this.getSelectorForCell(cell)).contains(cell.value);
        break;

      case 'longtext':
        cy.get(this.getSelectorForCell(cell)).contains(cell.value);
        break;

      case 'number':
        cy.get(this.getSelectorForCell(cell)).contains(cell.value.toString());
        break;

      case 'album':
        const albumViewPO = new AlbumViewPageObjectCypress(
          this.getSelectorForCell(cell)
        );
        albumViewPO.expectValue(cell.value);
        break;

      case 'html':
        const htmlViewPO = new HtmlViewPageObjectCypress(
          this.getSelectorForCell(cell)
        );
        htmlViewPO.expectValue(cell.value);
        break;

      case 'address':
        const addressViewPO = new AddressViewPageObjectCypress(
          this.getSelectorForCell(cell)
        );
        addressViewPO.expectValue(cell.value);
        break;

      default:
        break;
    }
  }

  expectNoCell(cell: TheThingCell) {
    cy.get(this.getSelectorForCell(cell)).should('not.exist');
  }

  expectNoCellAtAll() {
    cy.get(this.getSelectorForCell()).should('not.exist');
  }

  expectTags(tags: string[]) {
    cy.wrap(tags).each((tag: string) => {
      cy.get(this.getSelector('tags')).contains(tag);
    });
  }

  expectName(name: string) {
    cy.get(this.getSelector('name')).contains(name);
  }

  expectOwner(user: User) {
    cy.get(this.getSelector('owner')).contains(user.name);
  }

  expectValue(theThing: TheThing) {
    this.expectTags(theThing.tags.toIDArray());

    this.expectName(theThing.name);

    // Expect cells
    cy.wrap(values(theThing.cells)).each((cell: any) => {
      this.expectCell(cell);
    });
  }

  expectRelation(relationName: string, objectThing: TheThing) {
    const theThingListPO = new ImageThumbnailListPageObjectCypress(
      this.getSelectorForRelation(relationName)
    );
    theThingListPO.expectItemByNameAndImage(objectThing);
  }

  expectRelations(relationName: string, objectThings: TheThing[]) {
    cy.wrap(objectThings).each((objectThing: any) =>
      this.expectRelation(relationName, objectThing)
    );
  }

  expectNoRelation(relationName: string) {
    cy.get(this.getSelectorForRelation(relationName)).should('not.exist');
  }

  expectNoRelationObject(relationName: string, objectThing: TheThing) {
    const theThingListPO = new TheThingListPageObjectCypress(
      this.getSelectorForRelation(relationName)
    );
    theThingListPO.expectNoTheThing(objectThing);
  }

  linkRelationBack() {
    cy.get(this.getSelector('buttonLinkRelationBack')).click({ force: true });
  }

  expectNotLinkRelationBack() {
    cy.get(this.getSelector('buttonLinkRelationBack')).should('not.exist');
  }

  gotoCreateByClone() {
    cy.get(this.getSelector('buttonCreateByClone')).click({ force: true });
  }
}
