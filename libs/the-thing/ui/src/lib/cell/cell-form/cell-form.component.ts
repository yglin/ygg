import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TheThingCell } from '@ygg/the-thing/core';

@Component({
  selector: 'the-thing-cell-form',
  templateUrl: './cell-form.component.html',
  styleUrls: ['./cell-form.component.css']
})
export class CellFormComponent implements OnInit {
  @Output() submit: EventEmitter<TheThingCell> = new EventEmitter();
  
  constructor() { }

  ngOnInit() {
  }

}
