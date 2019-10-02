import { remove, filter, find, isArray } from "lodash";
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export interface GroupSwitchableItem {
  id: string;
  name: string;
}

export interface GroupSwitcherChangeEvent {
  left: GroupSwitchableItem[];
  right: GroupSwitchableItem[];
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
    if (isArray(value)) {
      this._itemsLeft = [...value];
    }
  }
  get itemsLeft(): GroupSwitchableItem[] {
    return this._itemsLeft;
  }
  @Input() titleLeft: string = 'Left Items';
  @Input() copyLeft: boolean = false;

  _itemsRight: GroupSwitchableItem[] = [];
  @Input()
  set itemsRight(value: GroupSwitchableItem[]) {
    if (isArray(value)) {
      this._itemsRight = [...value];
    }
  }
  get itemsRight(): GroupSwitchableItem[] {
    return this._itemsRight;
  }
  @Input() titleRight: string = 'Right Items';
  @Output() change: EventEmitter<GroupSwitcherChangeEvent> = new EventEmitter();
  @Output() selectLeft: EventEmitter<GroupSwitchableItem[]> = new EventEmitter();
  @Input() copyRight: boolean = false;

  selectionMap: { [SetId: string]: Set<string> } = {
    left: new Set([]),
    right: new Set([])
  };

  constructor() {}

  ngOnInit() {
    this.copyLeft = this.copyLeft !== undefined && this.copyLeft !== false;
    this.copyRight = this.copyRight !== undefined && this.copyRight !== false;
  }

  notifyChange() {
    this.change.emit({
      left: this.itemsLeft,
      right: this.itemsRight
    });
  }

  onClickItem(id: string, setId: string) {
    if (setId in this.selectionMap) {
      if (this.selectionMap[setId].has(id)) {
        this.selectionMap[setId].delete(id);
      } else {
        this.selectionMap[setId].add(id);
      }

      if (setId === 'left') {
        const selectedLeftItem = this.itemsLeft.filter(item => this.selectionMap[setId].has(item.id));
        this.selectLeft.emit(selectedLeftItem);
      }
    }
  }

  iSelectedIn(id: string, setId: string): boolean {
    return (setId in this.selectionMap) && this.selectionMap[setId].has(id);
  }

  hasSelectedItemsIn(setId: string) {
    return (setId in this.selectionMap) && this.selectionMap[setId].size > 0;
  }

  moveItems(from: string, to: string) {
    const groupFrom: GroupSwitchableItem[] = (from === "left") ? this.itemsLeft : this.itemsRight;
    const groupTo: GroupSwitchableItem[] = (from === "left") ? this.itemsRight : this.itemsLeft;
    const copyFrom = (from === "left") ? this.copyLeft : this.copyRight;

    const selectedItemIds = Array.from(this.selectionMap[from].values());
    let items: GroupSwitchableItem[];
    if (copyFrom) {
      items = filter(groupFrom, item => selectedItemIds.indexOf(item.id) >= 0);      
    } else {
      items = remove(groupFrom, item => selectedItemIds.indexOf(item.id) >= 0);
    }
    for (const item of items) {
      if (!find(groupTo, _item => _item.id === item.id)) {
        groupTo.push(item);
      }
    }
    this.selectionMap[from].clear();
    this.notifyChange();
  }
}
