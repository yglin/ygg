import { isEmpty, sortBy } from 'lodash';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSelectionListChange } from '@angular/material';
import { UserService } from '../../user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ygg-user-selector',
  templateUrl: './user-selector.component.html',
  styleUrls: ['./user-selector.component.css']
})
export class UserSelectorComponent implements OnInit {
  ids: string[] = [];
  selected: Set<string> = new Set([]);
  @Input()
  set selection(value: string[]) {
    if (!isEmpty(value)) {
      this.selected = new Set(value);
    }
  }
  get selection(): string[] {
    return Array.from(this.selected);
  }
  @Output() submit: EventEmitter<string[]> = new EventEmitter();
  @Input() multi: boolean = false;
  subscriptions: Subscription[] = [];

  constructor(private userService: UserService) {
    this.subscriptions.push(
      this.userService.listAll$().subscribe(users => {
        if (!isEmpty(users)) {
          this.ids = users.map(user => user.id);
        }
      })
    );
  }

  ngOnInit() {
    // If multiple select not allowed, leave only first one in selection;
    if (!this.multi && this.selection.length > 1) {
      this.selection = this.selection.slice(0, 1);
    }
  }

  orderBySelected(ids: string[]): string[] {
    return sortBy(ids, id => !this.isSelected(id));
  }

  hasSelected(): boolean {
    return this.selected.size > 0;
  }

  isSelected(id: string): boolean {
    return this.selected.has(id);
  }

  select(id: string) {
    if (!this.multi) {
      this.selected.clear();
    }
    this.selected.add(id);
  }

  deselect(id: string) {
    this.selected.delete(id);
  }

  toggleSelect(id: string) {
    if (this.isSelected(id)) {
      this.deselect(id);
    } else {
      this.select(id);
    }
  }

  onChangeSelection(selection: MatSelectionListChange) {
    const targetId = selection.option.value;
    this.toggleSelect(targetId);
  }

  onSubmit() {
    this.submit.next(this.selection);
  }
}
