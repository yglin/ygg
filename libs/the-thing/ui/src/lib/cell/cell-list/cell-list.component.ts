import { Component, OnInit, Input } from '@angular/core';
import { TheThingCell } from "@ygg/the-thing/core";

@Component({
  selector: 'the-thing-cell-list',
  templateUrl: './cell-list.component.html',
  styleUrls: ['./cell-list.component.css']
})
export class CellListComponent implements OnInit {
  @Input() cells: TheThingCell[];

  constructor() { }

  ngOnInit() {
  }

}
