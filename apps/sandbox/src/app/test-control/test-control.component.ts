import { Component, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Item } from '../item';


@Component({
  selector: 'ygg-item-control',
  templateUrl: './item-control.component.html',
  styleUrls: ['./item-control.component.css']
})
export class ItemControlComponent implements OnInit, OnDestroy, ControlValueAccessor {
  private _item: Item = new Item();
  get item(): Item

  subscriptions: Subscription[] = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
