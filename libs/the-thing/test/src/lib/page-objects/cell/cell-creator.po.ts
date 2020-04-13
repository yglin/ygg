import { CellCreatorPageObject } from '@ygg/the-thing/ui';
import { TheThingCell } from '@ygg/the-thing/core';
import { MaterialSelectPageObjectCypress } from '@ygg/shared/test/cypress';
import { OmniTypeControlPageObjectCypress } from '@ygg/shared/omni-types/test';

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
}
