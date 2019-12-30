import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TheThingCell } from '@ygg/the-thing/core';

@Component({
  selector: 'the-thing-cell-control',
  templateUrl: './cell-control.component.html',
  styleUrls: ['./cell-control.component.css']
})
export class CellControlComponent implements OnInit {
  @Input() cell: TheThingCell;
  @Input() formGroup: FormGroup;

  constructor() {}

  ngOnInit() {}
}
