import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TheThingCell } from '@ygg/the-thing/core';
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
  @Input() presetCells: TheThingCell[] = [];
  formControlPreset: FormControl = new FormControl();
  formGroupCreate: FormGroup;
  cellTypes = OmniTypes;
  dialogData: any;
  dialogOutput$: Observable<TheThingCell>;
  subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.formGroupCreate = this.formBuilder.group({
      name: null,
      type: null,
      value: null
    });
    this.dialogOutput$ = this.formGroupCreate.valueChanges.pipe(
      filter(cellData => cellData.name && cellData.type),
      // tap(cellData => {
      //   console.log('before new TheThingCell()');
      //   console.dir(cellData);
      // }),
      map(cellData => new TheThingCell(cellData)),
      // tap(cell => {
      //   console.log(`Output new cell: ${cell.name}`);
      //   console.dir(cell.toJSON());
      // })
    );
    const selectPreset$ = this.formControlPreset.valueChanges.pipe(
      map(selectName => find(this.presetCells, c => c.name === selectName)),
      filter(presetCell => !!presetCell),
      tap(presetCell => this.formGroupCreate.patchValue(presetCell))
    );
    this.subscriptions.push(selectPreset$.subscribe());
  }

  ngOnInit(): void {
    if (this.dialogData) {
      this.presetCells = get(this.dialogData, 'presetCells', []);
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
    return !isEmpty(this.presetCells);
  }
}
