import { CellCreatorPageObject } from '@ygg/the-thing/ui';
import { TheThingCell, TheThingCellDefine } from '@ygg/the-thing/core';
import { MaterialSelectPageObjectCypress } from '@ygg/shared/test/cypress';
import { OmniTypeControlPageObjectCypress } from '@ygg/shared/omni-types/test';
import { OmniTypes } from '@ygg/shared/omni-types/core';
import { find } from 'lodash';

export class CellCreatorPageObjectCypress extends CellCreatorPageObject {
  setCellValue(cell: TheThingCell) {
    const omniTypeControlPO = new OmniTypeControlPageObjectCypress(
      this.getSelector('valueControl')
    );
    omniTypeControlPO.setValue(cell.type, cell.value);
  }

  selectPreset(cellDefine: TheThingCellDefine): void {
    const matSelectPO = new MaterialSelectPageObjectCypress(
      this.getSelector('presetSelect')
    );
    matSelectPO.select(cellDefine.label);
    cy.get(this.getSelector('inputName'))
      .invoke('val')
      .should('equal', cellDefine.label);
    const typeSelectPO = new MaterialSelectPageObjectCypress(
      this.getSelector('selectType')
    );
    typeSelectPO.expectSelected(OmniTypes[cellDefine.type].label);
  }

  setCell(cell: TheThingCell) {
    const cellDefine: TheThingCellDefine = find(
      this.cellDefines,
      cd => cd.id === cell.id
    );
    if (cellDefine) {
      this.selectPreset(cellDefine);
    } else {
      cy.get(this.getSelector('inputName'))
        .clear()
        .type(cell.label);
      const typeSelectPO = new MaterialSelectPageObjectCypress(
        this.getSelector('selectType')
      );
      typeSelectPO.select(OmniTypes[cell.type].label);
    }
    this.setCellValue(cell);
  }
}
