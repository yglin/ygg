import { PageObject } from '@ygg/shared/test/page-object';
import { TheThingCell, TheThingCellDefine } from '@ygg/the-thing/core';
import { isEmpty } from 'lodash';

export abstract class CellCreatorPageObject extends PageObject {
  selectors = {
    main: '.cell-creator',
    presetSelect: '.presets',
    valueControl: '.value-control',
    inputName: 'input.label',
    selectType: '.cell-type'
  };

  cellDefines: TheThingCellDefine[] = [];

  constructor(parentSelector: string, cellDefines: TheThingCellDefine[]) {
    super(parentSelector);
    this.cellDefines = !isEmpty(cellDefines) ? cellDefines : [];
  }

  abstract setCell(cell: TheThingCell): void;
  abstract selectPreset(cellDefine: TheThingCellDefine): void;
  abstract setCellValue(cell: TheThingCell): void;
}
