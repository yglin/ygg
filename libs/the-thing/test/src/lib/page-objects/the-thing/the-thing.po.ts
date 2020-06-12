import { OmniTypeViewControlPageObjectCypress } from '@ygg/shared/omni-types/test';
import {
  EmceePageObjectCypress,
  ImageThumbnailListPageObjectCypress,
  YggDialogPageObjectCypress
} from '@ygg/shared/ui/test';
import {
  TheThing,
  TheThingCell,
  TheThingCellDefine,
  Relationship,
  TheThingAction,
  TheThingImitation
} from '@ygg/the-thing/core';
import {
  CellCreatorPageObjectCypress,
  TheThingThumbnailPageObjectCypress
} from '@ygg/the-thing/test';
import { TheThingPageObject } from '@ygg/the-thing/ui';
import { values } from 'lodash';
import { TheThingStatePageObjectCypress } from './the-thing-state.po';

export class TheThingPageObjectCypress extends TheThingPageObject {
  constructor(parentSelector: string, imitation: TheThingImitation) {
    super(parentSelector, imitation);
    this.statePO = new TheThingStatePageObjectCypress(
      this.getSelector('state')
    );
  }
  expectVisible(): Cypress.Chainable<any> {
    return cy.get(this.getSelector()).should('be.visible');
  }

  expectName(value: string): void {
    cy.get(this.getSelector('name')).contains(value);
  }

  expectValue(theThing: TheThing): void {
    this.expectName(theThing.name);
    cy.wrap(values(theThing.cells)).each((cell: TheThingCell) => {
      cy.get(this.getSelectorForCell(cell))
        .scrollIntoView()
        .should('be.visible');
      const omniTypeViewControlPO = new OmniTypeViewControlPageObjectCypress(
        this.getSelectorForCell(cell)
      );
      omniTypeViewControlPO.expectValue(cell.type, cell.value);
    });
  }

  setCell(cell: TheThingCell) {
    const omniTypeViewControlPO = new OmniTypeViewControlPageObjectCypress(
      this.getSelectorForCell(cell.name)
    );
    omniTypeViewControlPO.setValue(cell.type, cell.value);
  }

  setValue(theThing: TheThing) {
    this.setName(theThing.name);

    const orderedRequiredCells = theThing.getCellsByNames(
      this.imitation.getRequiredCellNames()
    );

    cy.wrap(orderedRequiredCells).each((cell: TheThingCell, index: number) =>
      this.setCell(cell)
    );

    const additionalCells = this.imitation.pickNonRequiredCells(
      values(theThing.cells)
    );

    cy.wrap(additionalCells).each((cell: any) => {
      this.addCell(cell);
      this.expectCell(cell);
    });
  }

  expectCell(cell: TheThingCell) {
    cy.get(`${this.getSelectorForCell(cell.name)}`).contains(cell.name);
    const cellViewPagePO = new OmniTypeViewControlPageObjectCypress(
      this.getSelectorForCell(cell.name)
    );
    cellViewPagePO.expectValue(cell.type, cell.value);
  }

  expectNoCell(cell: TheThingCell): void {
    cy.get(`${this.getSelectorForCell(cell.name)}`).should('not.be.visible');
  }

  addCell(cell: TheThingCell) {
    cy.get(this.getSelector('buttonAddCell')).click();
    const dialogPO = new YggDialogPageObjectCypress();
    dialogPO.expectVisible();
    const cellCreatorPO = new CellCreatorPageObjectCypress(
      dialogPO.getSelector()
    );
    cellCreatorPO.setCell(cell);
    cellCreatorPO.setCellValue(cell);
    dialogPO.confirm();
    dialogPO.expectClosed();
  }

  setName(name: any) {
    const omniTypeViewControlPO = new OmniTypeViewControlPageObjectCypress(
      this.getSelector('name')
    );
    omniTypeViewControlPO.setValue('text', name);
  }

  clickSave(): void {
    cy.get(this.getSelector('buttonSave')).click();
  }

  save(theThing: TheThing) {
    this.clickSave();
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(`確定要儲存 ${theThing.name} ？`);
    emceePO.alert(`已成功儲存 ${theThing.name}`);
  }

  expectFreshNew() {
    this.expectError(
      this.getSelector('name'),
      `請填入${this.imitation.name}名稱`
    );
    const firstRequiredCell: TheThingCellDefine = this.imitation.getFirstRequiredCellDef();
    this.expectError(
      this.getSelectorForCell(firstRequiredCell.name),
      `請填入${firstRequiredCell.name}資料`
    );
    // Only show first required cell, hide others
    for (const key in this.imitation.cellsDef) {
      if (this.imitation.cellsDef.hasOwnProperty(key)) {
        const cellDef = this.imitation.cellsDef[key];
        if (cellDef.name !== firstRequiredCell.name) {
          cy.get(this.getSelectorForCell(cellDef.name)).should(
            'not.be.visible'
          );
        }
      }
    }
  }

  expectError(selector: string, errorMessage: string) {
    cy.get(selector).should('include.text', errorMessage);
  }

  expectAdditions(additions: TheThing[]) {
    const additionListPO = new ImageThumbnailListPageObjectCypress(
      this.getSelector('additionList')
    );
    additionListPO.expectItems(additions);
  }

  expectNoCells(cells: TheThingCell[]) {
    cy.wrap(cells).each((cell: TheThingCell) => {
      cy.get(this.getSelectorForCell(cell)).should('not.be.visible');
    });
  }

  // expectEquipments(equipments: TheThing[]) {
  //   cy.wrap(equipments).each((equip: TheThing) => {
  //     const equipSelector = this.getSelectorForEquipment(equip);
  //     const theThingThumbnailPO = new TheThingThumbnailPageObjectCypress(
  //       equipSelector,
  //       ImitationEquipment
  //     );
  //     theThingThumbnailPO.expectValue(equip);
  //   });
  // }

  gotoCreateRelationObject(relationship: Relationship): void {
    cy.get(this.getSelectorForRelationCreateButton(relationship.name)).click();
  }

  expectRelationObjects(relationship: Relationship, objects: TheThing[]): void {
    cy.wrap(objects).each((obj: TheThing) => {
      const objectSelector = this.getSelectorForRelationObject(
        relationship.name,
        obj
      );
      const theThingThumbnailPO = new TheThingThumbnailPageObjectCypress(
        objectSelector,
        relationship.imitation
      );
      theThingThumbnailPO.expectValue(obj);
    });
  }

  deleteCell(cell: TheThingCell) {
    cy.get(this.getSelectorForCellDeleteButton(cell.name)).click();
  }

  runAction(action: TheThingAction) {
    cy.get(this.getSelectorForActionButton(action), { timeout: 10000 }).click();
  }

  expectActionButton(action: TheThingAction) {
    cy.get(this.getSelectorForActionButton(action)).should('be.visible');
  }

  expectNoActionButton(action: TheThingAction) {
    cy.get(this.getSelectorForActionButton(action)).should('not.be.visible');
  }

  expectModifiable(): void {
    cy.get(this.getSelectorForModifyButtons()).should('be.visible');
  }

  expectReadonly(): void {
    cy.get(this.getSelectorForModifyButtons()).should('not.be.visible');
  }
}
