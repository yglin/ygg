import { isEmpty } from 'lodash';
import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  SimpleChanges
} from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { Subscription } from 'rxjs';
import { TheThingAccessService } from '../../the-thing-access.service';

@Component({
  selector: 'the-thing-list',
  templateUrl: './the-thing-list.component.html',
  styleUrls: ['./the-thing-list.component.css']
})
export class TheThingListComponent implements OnInit, OnChanges {
  @Input() ids: string[];
  @Input() theThings: TheThing[];
  @Output() clickTheThing: EventEmitter<TheThing> = new EventEmitter();
  @Output() selectChange: EventEmitter<TheThing[]> = new EventEmitter();
  @Output() delete: EventEmitter<TheThing> = new EventEmitter();
  subscriptionFetchTheThings: Subscription;
  selection: Set<string> = new Set([]);
  isSelectable = false;
  isDeletable = false;

  constructor(private theThingAccessService: TheThingAccessService) {}

  ngOnInit() {
    this.isSelectable = this.selectChange.observers.length > 0;
    this.isDeletable = this.delete.observers.length > 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (!isEmpty(this.ids)) {
      if (this.subscriptionFetchTheThings)
        this.subscriptionFetchTheThings.unsubscribe();
      this.subscriptionFetchTheThings = this.theThingAccessService
        .listByIds$(this.ids)
        .subscribe(theThings => (this.theThings = theThings));
    }
  }

  isSelected(theThing: TheThing): boolean {
    return this.selection.has(theThing.id);
  }

  onClickTheThing(theThing: TheThing) {
    if (this.isSelectable) {
      if (this.selection.has(theThing.id)) {
        this.selection.delete(theThing.id);
      } else {
        this.selection.add(theThing.id);
      }
      const selectedThings = this.theThings.filter(thing =>
        this.isSelected(thing)
      );
      this.selectChange.emit(selectedThings);
    }
    this.clickTheThing.emit(theThing);
  }

  onDelete(theThing: TheThing) {
    if (theThing) {
      this.delete.emit(theThing);
    }
  }
}
