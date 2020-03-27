import { values } from 'lodash';
import { TheThing, TheThingCell, TheThingImitation } from '@ygg/the-thing/core';
import { TheThingEditorPageObject } from '@ygg/the-thing/ui';
import { ChipsControlPageObjectCypress } from '@ygg/shared/test/cypress';
import { ImageThumbnailListPageObjectCypress } from '@ygg/shared/ui/test';
import { TheThingFinderPageObjectCypress } from './the-thing-finder.po';
import { TheThingCellsEditorPageObjectCypress } from '../cell';
import { RelationsEditorPageObjectCypress } from '../relation';

export class TheThingEditorPageObjectCypress extends TheThingEditorPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.theThingCellsEditorPO = new TheThingCellsEditorPageObjectCypress(
      this.getSelector('cellsEditor')
    );
  }

  expectVisible() {
    cy.get(this.getSelector(), { timeout: 20000 }).should('be.visible');
  }

  setTags(tags: string[]) {
    const chipsControlPO = new ChipsControlPageObjectCypress(
      this.getSelector()
    );
    chipsControlPO.setValue(tags);
  }

  setName(name: string) {
    cy.get(this.getSelector('inputMetaName'))
      .clear({ force: true })
      .type(name);
  }

  setView(view: string) {
    if (!!view) {
      cy.get(this.getSelector('selectView')).select(view);
    }
  }

  // setImitation(imitationId: string) {
  //   cy.get(this.getSelector('selectImitation')).select(imitationId);
  // }

  // deleteCell(cell: TheThingCell) {
  //   cy.get(this.getSelectorForCellControlDelete(cell)).click({ force: true });
  // }

  // deleteAllCells() {
  //   cy.get(this.getSelector('buttonDeleteAllCells')).click({ force: true });
  // }

  expectValue(theThing: TheThing) {
    const chipsControlPO = new ChipsControlPageObjectCypress(
      this.getSelector()
    );
    chipsControlPO.expectValue(theThing.tags.toNameArray());
    cy.get(this.getSelector('inputMetaName'))
      .invoke('val')
      .should('equal', theThing.name);
    this.theThingCellsEditorPO.expectValue(values(theThing.cells));
  }

  setValue(theThing: TheThing) {
    this.setTags(theThing.tags.toNameArray());
    this.setName(theThing.name);
    this.setView(theThing.view);
    this.theThingCellsEditorPO.setValue(values(theThing.cells));
  }

  addRelationExist(relationName: string, objectThing: TheThing) {
    cy.get(this.getSelector('inputRelationName'))
      .clear()
      .type(relationName);
    cy.get(this.getSelector('buttonAddRelation')).click();
    const relationsEditorPO = new RelationsEditorPageObjectCypress(
      this.getSelectorForRelationsEditor(relationName)
    );
    relationsEditorPO.expectVisible();
    relationsEditorPO.addExistObject(objectThing);
  }

  removeRelation(relationName: string, objectThing: TheThing) {
    const relationsEditorPO = new RelationsEditorPageObjectCypress(
      this.getSelectorForRelationsEditor(relationName)
    );
    relationsEditorPO.expectVisible();
    relationsEditorPO.deleteObjects([objectThing]);
  }

  expectRelation(relationName: string, objectThing?: TheThing) {
    const relationsEditorPO = new RelationsEditorPageObjectCypress(
      this.getSelectorForRelationsEditor(relationName)
    );
    relationsEditorPO.expectVisible();
    if (objectThing) {
      relationsEditorPO.expectObject(objectThing);
    }
  }

  addRelationAndGotoCreate(relationName: string) {
    cy.get(this.getSelector('inputMetaName'))
      .invoke('val')
      .as('relationSubjectName');
    cy.get(this.getSelector('inputRelationName'))
      .clear()
      .type(relationName);
    cy.get(this.getSelector('buttonAddRelation')).click();
    const relationsEditorPO = new RelationsEditorPageObjectCypress(
      this.getSelectorForRelationsEditor(relationName)
    );
    relationsEditorPO.expectVisible();
    relationsEditorPO.gotoCreateRelationObject();
    cy.get('@relationSubjectName').then((relationSubjectName: any) => {
      this.expectRelationHint(relationName, relationSubjectName);
    });
  }

  cancelRelationCreate() {
    cy.get(this.getSelector('buttonCancelCreateRelation')).click();
  }

  expectRelationHint(relationName: string, subjectName: string) {
    cy.get(this.getSelector('relationCreateHint'), { timeout: 10000 }).should(
      'include.text',
      `關聯物件：${relationName} → ${subjectName}`
    );
  }

  expectNoRelationHint() {
    cy.get(this.getSelector('relationCreateHint'), { timeout: 10000 }).should(
      'not.be.visible'
    );
  }

  expectImitaion(imitation: TheThingImitation) {
    cy.get(this.getSelector('buttonOpenImitations'), {
      timeout: 10000
    }).click();
    const imitationSelectorDialogPO = new ImageThumbnailListPageObjectCypress();
    imitationSelectorDialogPO.expectVisible();
    imitationSelectorDialogPO.expectItem(imitation);
  }

  applyImitation(imitation: TheThingImitation) {
    cy.get(this.getSelector('buttonOpenImitations'), {
      timeout: 10000
    }).click();
    const imitationSelectorDialogPO = new ImageThumbnailListPageObjectCypress();
    imitationSelectorDialogPO.expectVisible();
    imitationSelectorDialogPO.selectItem(imitation);
    imitationSelectorDialogPO.submit();
    imitationSelectorDialogPO.expectVisible(false);
  }

  extendValue(theThing: TheThing) {
    this.setTags(theThing.tags.toNameArray());
    this.setName(theThing.name);
    this.setView(theThing.view);
    this.theThingCellsEditorPO.updateValue(values(theThing.cells));

    // // Set cells value, here is the difference from setValue().
    // // Each cell control should already be there
    // cy.wrap(values(theThing.cells)).each((cell: any) => {
    //   cy.get(this.getSelectorForCellControl(cell)).should('be.exist');
    //   this.setCell(cell);
    // });
  }

  // updateCellValues(cells: TheThingCell[]) {
  //   cy.wrap(cells).each((cell: any) => {
  //     cy.get(this.getSelectorForCellControl(cell)).should('be.exist');
  //     this.setCell(cell);
  //   });
  // }

  submit() {
    // Submit
    cy.get('button.submit').click();
  }
}
