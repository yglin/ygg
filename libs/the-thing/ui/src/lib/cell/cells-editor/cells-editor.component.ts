import {
  Component,
  Input,
  OnInit,
  forwardRef,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Injector,
  AfterViewInit
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  Validators,
  FormControl,
  NgControl
} from '@angular/forms';
import {
  TheThingCell,
  TheThing,
  TheThingImitation
} from '@ygg/the-thing/core';
import {
  isArray,
  isEmpty,
  keyBy,
  noop,
  size,
  keys,
  remove,
  clone,
  values
} from 'lodash';
import { Subscription } from 'rxjs';
import { PageResolverService } from '@ygg/shared/ui/navigation';
import { OmniTypes } from '@ygg/shared/omni-types/core';

@Component({
  selector: 'the-thing-cells-editor',
  templateUrl: './cells-editor.component.html',
  styleUrls: ['./cells-editor.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TheThingCellsEditorComponent),
      multi: true
    }
  ]
})
export class TheThingCellsEditorComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  control: FormControl;
  cells: { [key: string]: TheThingCell } = {};
  @Input() cellsOrder: string[] = [];
  formGroup: FormGroup;
  formGroupAddCell: FormGroup;
  onChange: (value: { [key: string]: TheThingCell }) => any = noop;
  onTouched: () => any = noop;
  subscriptions: Subscription[] = [];
  cellTypes = OmniTypes;
  canDeleteAllCells = false;
  isPage = false;
  imitation: TheThingImitation;

  constructor(
    private formBuilder: FormBuilder,
    // private theThingFactory: TheThingFactoryService,
    private pageResolver: PageResolverService,
    // private location: Location,
    // private injector: Injector
  ) {
    this.formGroup = this.formBuilder.group({});
    this.formGroupAddCell = this.formBuilder.group({
      name: [null, Validators.required],
      type: [null, Validators.required]
    });

    this.subscriptions.push(
      this.formGroup.valueChanges.subscribe(
        (formGroupValue: { [key: string]: any }) => {
          for (const key in formGroupValue) {
            if (formGroupValue.hasOwnProperty(key)) {
              const controlValue = formGroupValue[key];
              if (key in this.cells) {
                this.cells[key].value = controlValue;
              }
            }
          }
          this.onChange(this.cells);
        }
      )
    );
  }

  writeValue(cells: TheThingCell[] | { [key: string]: TheThingCell }): void {
    // console.log('TheThingCellsEditor: writeValue is called');
    if (isArray(cells)) {
      cells = keyBy(cells, 'name');
    } else {
      cells = isEmpty(cells) ? {} : cells;
    }
    // console.log(cells);
    // Force Angular refresh view
    this.deleteAllCells();
    setTimeout(() => {
      for (const name in cells) {
        if (cells.hasOwnProperty(name)) {
          const cell = cells[name].clone();
          this.addCell(cell);
        }
      }
      if (isEmpty(this.cellsOrder)) {
        this.cellsOrder = keys(this.cells);
      }
    }, 0);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}

  ngOnInit() {
    if (this.pageResolver.isPending()) {
      this.isPage = true;
      const inputData = this.pageResolver.getInput();
      this.imitation = inputData.imitation;
      this.writeValue(inputData.cells);
    }
    if (this.imitation) {
      if (isEmpty(this.cellsOrder)) {
        this.cellsOrder = this.imitation.cellsOrder;
      }
    }
    // if (isEmpty(this.cellsOrder)) {
    //   this.cellsOrder = keys(this.cells);
    // }
    // console.log(this.cells);
    // console.log(this.cellsOrder);
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  addCell(cell: TheThingCell) {
    this.cells[cell.id] = cell;
    this.formGroup.addControl(cell.id, new FormControl(cell.value));
    this.canDeleteAllCells = size(this.formGroup.controls) >= 1;
  }

  onClickDeleteCell(cellId: string) {
    const confirmMessage = `確定要刪除資料欄位：${cellId}？`;
    if (confirm(confirmMessage)) {
      if (cellId in this.cells) {
        delete this.cells[cellId];
      }
      if (cellId in this.formGroup.controls) {
        this.formGroup.removeControl(cellId);
      }
      this.onChange(this.cells);
      this.canDeleteAllCells = size(this.formGroup.controls) >= 1;
      remove(this.cellsOrder, name => name === cellId);
    }
  }

  onClickAddCell() {
    const newCellId = this.formGroupAddCell.get('name').value;
    if (newCellId in this.cells) {
      alert(
        `資料欄位 ${newCellId} 已存在了喔？\n請檢查是否重複或是取新的名稱。`
      );
    } else {
      const newCellType = this.formGroupAddCell.get('type').value;
      const cell = new TheThingCell().fromJSON({
        name: newCellId,
        type: newCellType,
        value: null
      });
      this.addCell(cell);
      this.onChange(this.cells);
      if (this.cellsOrder.indexOf(cell.id) < 0) {
        this.cellsOrder.push(cell.id);
      }
    }
  }

  onClickDeleteAllCells() {
    const confirmMessage = `注意：一旦刪除並且儲存，資料便無法回復，確定要刪除所有資料欄位？`;
    if (confirm(confirmMessage)) {
      this.deleteAllCells();
    }
  }

  deleteAllCells() {
    this.cells = {};
    for (const controlName in this.formGroup.controls) {
      if (this.formGroup.controls.hasOwnProperty(controlName)) {
        // const control = this.formGroup.controls[controlName];
        this.formGroup.removeControl(controlName);
      }
    }
    this.onChange(this.cells);
    this.canDeleteAllCells = size(this.formGroup.controls) >= 1;
  }

  submit() {
    const confirmMessage = `確定要新增/修改這些資料？`;
    if (confirm(confirmMessage)) {
      if (this.pageResolver.isPending()) {
        this.pageResolver.back({ cells: values(this.cells) });
      }
    }
  }
}
