import { Component, OnInit } from '@angular/core';
import { TheThingCell } from '@ygg/the-thing/core';

@Component({
  selector: 'the-thing-cell-edit',
  templateUrl: './cell-edit.component.html',
  styleUrls: ['./cell-edit.component.css']
})
export class CellEditComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onSubmit(cell: TheThingCell) {
    
  }
}
