import { CellCreatorPageObject } from '@ygg/the-thing/ui';
import { TheThingCell } from '@ygg/the-thing/core';
import { MaterialSelectPageObjectCypress } from '@ygg/shared/test/cypress';
import { OmniTypeControlPageObjectCypress } from '@ygg/shared/omni-types/test';
import { OmniTypes } from '@ygg/shared/omni-types/core';

export class CellCreatorPageObjectCypress extends CellCreatorPageObject {
  setCellValue(cell: TheThingCell) {
    const omniTypeControlPO = new OmniTypeControlPageObjectCypress(
      this.getSelector('valueControl')
    );
    omniTypeControlPO.setValue(cell.type, cell.value);
  }

  selectPreset(cellName: string): void {
    const matSelectPO = new MaterialSelectPageObjectCypress(
      this.getSelector('presetSelect')
    );
    matSelectPO.select(cellName);
  }

  setCell(cell: TheThingCell) {
    cy.get(this.getSelector('inputName'))
      .clear()
      .type(cell.name);
    const typeSelectPO = new MaterialSelectPageObjectCypress(
      this.getSelector('selectType')
    );
    const typeLabel = OmniTypes[cell.type].label;
    typeSelectPO.select(typeLabel);
    const omniTypeControlPO = new OmniTypeControlPageObjectCypress(
      this.getSelector('valueControl')
    );
    omniTypeControlPO.setValue(cell.type, cell.value);
  }
}
