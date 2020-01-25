import { Component, OnInit, Input } from '@angular/core';
import { TheThingCell } from "@ygg/the-thing/core";

@Component({
  selector: 'the-thing-cell-view',
  templateUrl: './cell-view.component.html',
  styleUrls: ['./cell-view.component.css']
})
export class CellViewComponent implements OnInit {
  @Input() cell: TheThingCell;
  
  constructor() { }

  ngOnInit() {
    console.log(this.cell.value);
  }

}
