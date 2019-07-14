import { remove } from "lodash";
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface GroupSwitchableItem {
  id: string;
  name: string;
}

@Component({
  selector: 'ygg-items-group-switcher',
  templateUrl: './items-group-switcher.component.html',
  styleUrls: ['./items-group-switcher.component.css']
})
export class ItemsGroupSwitcherComponent implements OnInit {
  _itemsLeft: GroupSwitchableItem[] = [];
  @Input()
  set itemsLeft(value: GroupSwitchableItem[]) {
    if (value) {
      this._itemsLeft = [...value];
    }
  }
  get itemsLeft(): GroupSwitchableItem[] {
    return this._itemsLeft;
  }
  @Input() titleLeft: string = 'Left Items';

  _itemsRight: GroupSwitchableItem[] = [];
  @Input()
  set itemsRight(value: GroupSwitchableItem[]) {
    if (value) {
      this._itemsRight = [...value];
    }
  }
  get itemsRight(): GroupSwitchableItem[] {
    return this._itemsRight;
  }
  @Input() titleRight: string = 'Right Items';
  @Output() submit: EventEmitter<any> = new EventEmitter();

  selectionMap: { [SetId: string]: Set<string> } = {
    left: new Set([]),
    right: new Set([])
  };

  constructor() {}

  ngOnInit() {}

  onClickItem(id: string, setId: string) {
    if (setId in this.selectionMap) {
      if (this.selectionMap[setId].has(id)) {
        this.selectionMap[setId].delete(id);
      } else {
        this.selectionMap[setId].add(id);
      }
    }
  }

  iSelectedIn(id: string, setId: string): boolean {
    return (setId in this.selectionMap) && this.selectionMap[setId].has(id);
  }

  hasSelectedItemsIn(setId: string) {
    return (setId in this.selectionMap) && this.selectionMap[setId].size > 0;
  }

  moveItemsToRight() {
    const selectedItemIds = Array.from(this.selectionMap['left'].values());
    const items = remove(this.itemsLeft, item => selectedItemIds.indexOf(item.id) >= 0);
    // console.log(`Move \n${items.join('\n')}\nto right group`);
    this.itemsRight.push.apply(this.itemsRight, items);
    this.selectionMap['left'].clear();
  }

  moveItemsToLeft() {
    const selectedItemIds = Array.from(this.selectionMap['right'].values());
    const items = remove(this.itemsRight, item => selectedItemIds.indexOf(item.id) >= 0);
    // console.log(`Move \n${items.join('\n')}\nto right group`);
    this.itemsLeft.push.apply(this.itemsLeft, items);
    this.selectionMap['right'].clear();
  }

  onSubmit() {
    this.submit.emit({
      left: this.itemsLeft,
      right: this.itemsRight
    });
  }
}
