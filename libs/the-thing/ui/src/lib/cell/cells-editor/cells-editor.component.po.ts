import { PageObject } from '@ygg/shared/test/page-object';
import { TheThingCell } from '@ygg/the-thing/core';

export abstract class TheThingCellsEditorPageObject extends PageObject {
  selectors = {
    main: '.the-thing-cells-editor',
    deleteAll: 'button.delete-all',
    inputCellName: 'input.name',
    selectCellType: 'select.cell-type',
    buttonAddCell: 'button.add-cell',
    buttonSubmit: 'button.submit'
  };

  getSelectorForCellControl(cell?: TheThingCell): string {
    if (cell) {
      return `${this.getSelector()} [cell-name="${cell.name}"]`;
    } else {
      return `${this.getSelector()} [cell-name]`;
    }
  }

  getSelectorForCellDeleteButton(cell: TheThingCell): string {
    return `${this.getSelectorForCellControl(cell)} button.delete`;
  }

  abstract expectVisible(): any;
  abstract addCell(cell: TheThingCell): void;
  abstract setCellValue(cell: TheThingCell): void;
  abstract addValue(cells: TheThingCell[]):void;
  abstract updateValue(cells: TheThingCell[]): void;
  abstract setValue(cells: TheThingCell[]): void;
  abstract deleteCell(cell: TheThingCell): void;
  abstract clearAll(): void;
  abstract expectValue(cells: TheThingCell[]): void;
  abstract submit(): void;
}
