import { EquipmentViewPageObject } from '@ygg/playwhat/ui';
import { TheThing, TheThingCell, TheThingCellDefine } from '@ygg/the-thing/core';
import { values } from 'lodash';
import { OmniTypeViewControlPageObjectCypress } from '@ygg/shared/omni-types/test';
import { ImitationEquipment, ImitationEquipmentCellDefines } from '@ygg/playwhat/core';
import { YggDialogPageObjectCypress, EmceePageObjectCypress, ImageThumbnailListPageObjectCypress } from '@ygg/shared/ui/test';
import { CellCreatorPageObjectCypress } from '@ygg/the-thing/test';

export class EquipmentViewPageObjectCypress extends EquipmentViewPageObject {
  expectVisible(): Cypress.Chainable<any> {
    return cy.get(this.getSelector(), { timeout: 10000 }).should('be.visible');
  }

  expectValue(play: TheThing): void {
    cy.get(this.getSelector('name')).contains(play.name);
    cy.wrap(values(play.cells)).each((cell: TheThingCell) => {
      cy.get(this.getSelectorForCell(cell.name))
        .scrollIntoView()
        .should('be.visible');
      const omniTypeViewControlPO = new OmniTypeViewControlPageObjectCypress(
        this.getSelectorForCell(cell.name)
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

  setValue(play: TheThing) {
    this.setName(play.name);

    const orderedRequiredCells = play.getCellsByNames(
      ImitationEquipment.getRequiredCellNames()
    );

    cy.wrap(orderedRequiredCells).each((cell: TheThingCell, index: number) =>
      this.setCell(cell)
    );

    const additionalCells = ImitationEquipment.pickNonRequiredCells(
      values(play.cells)
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

  save(play: TheThing) {
    cy.get(this.getSelector('buttonSave')).click();
    const emceePO = new EmceePageObjectCypress();
    emceePO.confirm(`確定要儲存 ${play.name} ？`);
    emceePO.alert(`已成功儲存 ${play.name}`);
  }

  expectFreshNew() {
    this.expectError(this.getSelector('name'), '請填入體驗名稱');
    const firstRequiredCell: TheThingCellDefine = ImitationEquipment.getFirstRequiredCellDef();
    this.expectError(
      this.getSelectorForCell(firstRequiredCell.name),
      `請填入${firstRequiredCell.name}資料`
    );
    // Only show first required cell, hide others
    for (const key in ImitationEquipmentCellDefines) {
      if (ImitationEquipmentCellDefines.hasOwnProperty(key)) {
        const cellDef = ImitationEquipmentCellDefines[key];
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

  gotoCreateEquipment() {
    cy.get(this.getSelector('buttonCreateEquipment')).click();
  }

  expectNoCells(cells: TheThingCell[]) {
    cy.wrap(cells).each((cell: TheThingCell) => {
      cy.get(this.getSelectorForCell(cell.name)).should('not.be.visible');
    });
  }

  deleteCell(cell: TheThingCell) {
    cy.get(this.getSelectorForCellDeleteButton(cell.name)).click();
  }
}
