import { Component, OnInit, OnDestroy } from '@angular/core';
import { TheThingCell } from "@ygg/the-thing/core";
import { CellAccessService } from "@ygg/the-thing/data-access";
import { Subscription } from 'rxjs';

@Component({
  selector: 'the-thing-cells',
  templateUrl: './cells.component.html',
  styleUrls: ['./cells.component.css']
})
export class CellsComponent implements OnInit, OnDestroy {
  cells: TheThingCell[];
  subscriptions: Subscription[] = [];

  constructor(private cellsAccessService: CellAccessService) { }

  ngOnInit() {
    this.subscriptions.push(this.cellsAccessService.cells$.subscribe(cells => this.cells = cells));
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
