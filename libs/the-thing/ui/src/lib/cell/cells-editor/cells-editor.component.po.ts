import { PageObject } from '@ygg/shared/test/page-object';
import { TheThingCell } from '@ygg/the-thing/core';

export abstract class TheThingCellsEditorPageObject extends PageObject {
  selectors = {
    main: '.the-thing-cells-editor',
    deleteAll: 'button.delete-all',
    inputCellName: 'input.name',
    selectCellType: 'select.cell-type',
    buttonAddCell: 'button.add-cell'
  };

  getSelectorForCellControl(cell?: TheThingCell): string {
    if (cell) {
      return `${this.getSelector()} [cell-name="${cell.name}"]`;
    } else {
      return `${this.getSelector()} [cell-name]`;
    }
  }

  abstract updateValue(cells: TheThingCell[]): void;
  abstract setValue(cells: TheThingCell[]): void;
}
