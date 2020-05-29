import { PlayViewPageObject } from '@ygg/playwhat/ui';
import {
  TheThing,
  TheThingCellDefine,
  TheThingCell
} from '@ygg/the-thing/core';
import {
  AlbumViewPageObjectCypress,
  LocationViewPageObjectCypress,
  BusinessHoursViewPageObjectCypress,
  OmniTypeViewControlPageObjectCypress
} from '@ygg/shared/omni-types/test';
import { Purchase } from '@ygg/shopping/core';
import {
  AdditionViewPageObjectCypress,
  PurchaseListPageObjectCypress,
  PurchaseProductPageObjectCypress
} from '@ygg/shopping/test';
import {
  ImageThumbnailListPageObjectCypress,
  YggDialogPageObjectCypress,
  ConfirmDialogPageObjectCypress,
  EmceePageObjectCypress
} from '@ygg/shared/ui/test';
import { ImitationPlay, ImitationPlayCellDefines } from '@ygg/playwhat/core';
import { values } from 'lodash';
import { CellCreatorPageObjectCypress } from '@ygg/the-thing/test';

export class PlayViewPageObjectCypress extends PlayViewPageObject {
  constructor(parentSelector?: string) {
    super(parentSelector);
    this.albumViewPO = new AlbumViewPageObjectCypress(
      this.getSelector('album')
    );
  }

  purchase(purchases: Purchase[] = []) {
    cy.get(this.getSelector('buttonAddToCart')).click();
    const dialogPO = new YggDialogPageObjectCypress();
    const purchasePO = new PurchaseProductPageObjectCypress(
      dialogPO.getSelector()
    );
    purchasePO.setValue(purchases);
    dialogPO.confirm();
  }

  expectVisible(): Cypress.Chainable<any> {
    return cy.get(this.getSelector()).should('be.visible');
  }

  expectValue(play: TheThing): void {
    cy.get(this.getSelector('name')).contains(play.name);
    cy.wrap(values(play.cells)).each((cell: TheThingCell) => {
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

  setValue(play: TheThing) {
    this.setName(play.name);

    const orderedRequiredCells = play.getCellsByNames(
      ImitationPlay.getRequiredCellNames()
    );

    cy.wrap(orderedRequiredCells).each((cell: TheThingCell, index: number) =>
      this.setCell(cell)
    );

    const additionalCells = ImitationPlay.pickNonRequiredCells(
      values(play.cells)
    );

    console.log(additionalCells);

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
    const firstRequiredCell: TheThingCellDefine = ImitationPlay.getFirstRequiredCellDef();
    this.expectError(
      this.getSelectorForCell(firstRequiredCell.name),
      `請填入${firstRequiredCell.name}資料`
    );
    // Only show first required cell, hide others
    for (const key in ImitationPlayCellDefines) {
      if (ImitationPlayCellDefines.hasOwnProperty(key)) {
        const cellDef = ImitationPlayCellDefines[key];
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
}
