import { RelationsEditorPageObject } from '@ygg/the-thing/ui';
import { TheThing } from '@ygg/the-thing/core';
import {
  ImageThumbnailListPageObjectCypress,
  YggDialogPageObjectCypress
} from '@ygg/shared/ui/test';
import { TheThingFinderPageObjectCypress } from '../the-thing/the-thing-finder.po';

export class RelationsEditorPageObjectCypress extends RelationsEditorPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.imageThumbnailListPO = new ImageThumbnailListPageObjectCypress(
      this.getSelector('objectList')
    );
  }

  expectVisible() {
    cy.get(this.getSelector())
      .scrollIntoView()
      .should('be.visible');
  }

  expectRelationToSubject(relationName: string, subject: TheThing) {
    cy.get(this.getSelector('title'))
      .should('include.text', relationName)
      .should('include.text', subject.name);
  }

  gotoCreateRelationObject() {
    cy.get(this.getSelector('buttonCreateObject')).click();
  }

  expectObject(object: TheThing) {
    this.imageThumbnailListPO.expectItem(object);
  }

  addExistObject(object: TheThing) {
    cy.get(this.getSelector('buttonSelectObjects')).click();
    const dialogPO = new YggDialogPageObjectCypress();
    const theThingFinderPO = new TheThingFinderPageObjectCypress(
      dialogPO.getSelector()
    );
    dialogPO.expectVisible();
    theThingFinderPO.expectVisible();
    theThingFinderPO.select(object);
    dialogPO.confirm();
    dialogPO.expectClosed();
    this.expectObject(object);
  }

  deleteObjects(objects: TheThing[]): void {
    this.imageThumbnailListPO.selectItems(objects);
    cy.get(this.getSelector('buttonDeleteSelection')).click();
    this.imageThumbnailListPO.expectNoItems(objects);
  }
}
