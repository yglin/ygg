import { PageObject } from '@ygg/shared/test/page-object';
import { TheThingCell } from '@ygg/the-thing/core';

export abstract class CellCreatorPageObject extends PageObject {
  selectors = {
    main: '.cell-creator',
    presetSelect: '.presets',
    valueControl: '.value-control',
    inputName: 'input.name',
    selectType: '.cell-type'
  };

  abstract setCell(cell: TheThingCell): void;
  abstract selectPreset(cellName: string): void;
  abstract setCellValue(cell: TheThingCell): void;
}
