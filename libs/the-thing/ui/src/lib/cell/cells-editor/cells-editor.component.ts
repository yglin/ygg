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
  TheThingCellTypes,
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
import { timeout } from 'rxjs/operators';
import { TheThingFactoryService } from '../../the-thing-factory.service';
import { Location } from '@angular/common';
import { PageResolverService } from '@ygg/shared/ui/navigation';

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
  cellTypes = TheThingCellTypes;
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
    this.cells[cell.name] = cell;
    this.formGroup.addControl(cell.name, new FormControl(cell.value));
    this.canDeleteAllCells = size(this.formGroup.controls) >= 1;
  }

  onClickDeleteCell(cellName: string) {
    const confirmMessage = `確定要刪除資料欄位：${cellName}？`;
    if (confirm(confirmMessage)) {
      if (cellName in this.cells) {
        delete this.cells[cellName];
      }
      if (cellName in this.formGroup.controls) {
        this.formGroup.removeControl(cellName);
      }
      this.onChange(this.cells);
      this.canDeleteAllCells = size(this.formGroup.controls) >= 1;
      remove(this.cellsOrder, name => name === cellName);
    }
  }

  onClickAddCell() {
    const newCellName = this.formGroupAddCell.get('name').value;
    if (newCellName in this.cells) {
      alert(
        `資料欄位 ${newCellName} 已存在了喔？\n請檢查是否重複或是取新的名稱。`
      );
    } else {
      const newCellType = this.formGroupAddCell.get('type').value;
      const cell = new TheThingCell().fromJSON({
        name: newCellName,
        type: newCellType,
        value: null
      });
      this.addCell(cell);
      this.onChange(this.cells);
      if (this.cellsOrder.indexOf(cell.name) < 0) {
        this.cellsOrder.push(cell.name);
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
