import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { TheThingCell } from '@ygg/the-thing/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'the-thing-cell-control',
  templateUrl: './cell-control.component.html',
  styleUrls: ['./cell-control.component.css']
})
export class CellControlComponent implements OnInit, OnDestroy {
  @Input() cell: TheThingCell;
  @Input() formGroup: FormGroup;
  formControl: AbstractControl;
  subscriptions: Subscription[] = [];

  constructor() {}

  ngOnInit() {
    if (this.cell && this.formGroup) {
      this.formControl = this.formGroup.get(this.cell.name);
      this.subscriptions.push(
        this.formControl.valueChanges.subscribe(
          value => (this.cell.value = value)
        )
      );
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
