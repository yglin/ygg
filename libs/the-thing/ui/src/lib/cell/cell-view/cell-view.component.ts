import { Component, OnInit, Input } from '@angular/core';
import { TheThingCell } from '@ygg/the-thing/core';

@Component({
  selector: 'the-thing-cell-view',
  templateUrl: './cell-view.component.html',
  styleUrls: ['./cell-view.component.css']
})
export class CellViewComponent implements OnInit {
  @Input() cell: TheThingCell;
  @Input() editable: boolean;

  constructor() {}

  ngOnInit() {
    this.editable = this.editable !== undefined && this.editable !== false;
  }

  onChangeValue(value: any) {
    this.cell.value = value;
  }
}
