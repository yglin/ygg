import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TheThingCell, TheThingCellDefine } from '@ygg/the-thing/core';
import { isEmpty, find, get } from 'lodash';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { OmniTypes } from '@ygg/shared/omni-types/core';
import { YggDialogContentComponent } from '@ygg/shared/ui/widgets';
import { Observable, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'the-thing-cell-creator',
  templateUrl: './cell-creator.component.html',
  styleUrls: ['./cell-creator.component.css']
})
export class CellCreatorComponent
  implements OnInit, OnDestroy, YggDialogContentComponent {
  @Input() presets: TheThingCellDefine[] = [];
  selectedPreset: TheThingCellDefine;
  formControlPreset: FormControl = new FormControl();
  formGroupCreate: FormGroup;
  cellTypes = OmniTypes;
  dialogData: any;
  dialogOutput$: Observable<TheThingCell>;
  subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.formGroupCreate = this.formBuilder.group({
      label: null,
      type: null,
      value: null
    });
    this.dialogOutput$ = this.formGroupCreate.valueChanges.pipe(
      filter(cellData => cellData.label && cellData.type),
      // tap(cellData => {
      //   console.log('before new TheThingCell()');
      //   console.dir(cellData);
      // }),
      map(cellData => {
        if (this.selectedPreset) {
          return this.selectedPreset.createCell(cellData.value);
        } else {
          cellData.id = cellData.label;
          return new TheThingCell(cellData);
        }
      })
      // tap(cell => {
      //   console.log(`Output new cell: ${cell.label}`);
      //   console.dir(cell.toJSON());
      // })
    );
    const selectPreset$ = this.formControlPreset.valueChanges.pipe(
      map(selected =>
        find(this.presets, cellDefine => cellDefine.id === selected)
      ),
      filter(preset => !!preset),
      tap((preset: TheThingCellDefine) => {
        this.selectedPreset = preset;
        this.formGroupCreate
          .get('label')
          .setValue(preset.label, { emitEvent: false });
        this.formGroupCreate
          .get('type')
          .setValue(preset.type, { emitEvent: false });
        this.formGroupCreate.get('value').setValue(null, { emitEvent: false });
      })
    );
    this.subscriptions.push(selectPreset$.subscribe());
  }

  ngOnInit(): void {
    if (this.dialogData) {
      this.presets = get(this.dialogData, 'presets', []);
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  hasPresets(): boolean {
    return !isEmpty(this.presets);
  }
}
