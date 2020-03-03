import { Component, OnInit, Input } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { CellNamePrice, CellNameStock } from '@ygg/shopping/core';

@Component({
  selector: 'ygg-addition-view',
  templateUrl: './addition-view.component.html',
  styleUrls: ['./addition-view.component.css']
})
export class AdditionViewComponent implements OnInit {
  @Input() theThing: TheThing;
  CellNamePrice = CellNamePrice;
  CellNameStock = CellNameStock;

  constructor() {}

  ngOnInit() {}
}
