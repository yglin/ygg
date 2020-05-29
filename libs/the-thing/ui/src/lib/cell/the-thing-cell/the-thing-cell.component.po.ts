import { FormControl } from '@angular/forms';
import { TheThingCell } from '@ygg/the-thing/core';

export function validateCellRequired(
  control: FormControl
): { [key: string]: any } {
  const cell: TheThingCell = control.value as TheThingCell;
  return !!cell && !!cell.value
    ? null
    : {
        validateCellRequired: {
          message: `Require non-null value of cell ${!!cell ? cell.name : ''}`
        }
      };
}
