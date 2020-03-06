import { extend, remove, find, isEmpty } from 'lodash';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { ImageThumbnailItem } from '../image-thumbnail';
import { Observable, Subscription, Subject } from 'rxjs';
import { YggDialogContentComponent } from '../../dialog';
import { ImageThumbnailListPageObject } from './image-thumbnail-list.component.po';

@Component({
  selector: 'ygg-image-thumbnail-list',
  templateUrl: './image-thumbnail-list.component.html',
  styleUrls: ['./image-thumbnail-list.component.css']
})
export class ImageThumbnailListComponent
  implements OnInit, OnDestroy, YggDialogContentComponent {
  @Input() items: ImageThumbnailItem[];
  @Input() items$: Observable<ImageThumbnailItem[]>;
  @Input() readonly: boolean;
  @Output() clickItem: EventEmitter<ImageThumbnailItem> = new EventEmitter();
  @Output() clickAdd: EventEmitter<any> = new EventEmitter();
  @Output() deleteItems: EventEmitter<
    ImageThumbnailItem[]
  > = new EventEmitter();
  @Input() selection: ImageThumbnailItem[] = [];
  @Input() singleSelect: boolean;
  @Output() selectionChanged: EventEmitter<
    ImageThumbnailItem[]
  > = new EventEmitter();
  @Output() selectItem: EventEmitter<ImageThumbnailItem> = new EventEmitter();
  @Output() deselectItem: EventEmitter<ImageThumbnailItem> = new EventEmitter();
  @Input() hideAddButton: boolean;
  isSelectable: boolean = false;
  isItemDeletable: boolean = false;
  subscriptions: Subscription[] = [];

  dialogData: any;
  dialogSubmit$: Subject<
    ImageThumbnailItem | ImageThumbnailItem[]
  > = new Subject();

  constructor() {}

  ngOnInit() {
    if (this.dialogData) {
      extend(this, this.dialogData);
    }
    this.readonly = this.readonly !== undefined && this.readonly !== false;
    if (this.items$) {
      this.subscriptions.push(
        this.items$.subscribe(items => {
          this.items = items;
          this.selection.length = 0;
        })
      );
    }
    this.isItemDeletable = this.deleteItems.observers.length > 0;
    this.isSelectable =
      this.selectionChanged.observers.length > 0 ||
      this.dialogSubmit$.observers.length > 0 ||
      this.selectItem.observers.length > 0 ||
      this.deselectItem.observers.length > 0 ||
      this.isItemDeletable;
    this.hideAddButton =
      this.readonly ||
      (this.hideAddButton !== undefined && this.hideAddButton !== false);
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onClickItem(item: ImageThumbnailItem) {
    this.clickItem.emit(item);
    if (find(this.selection, selected => selected.id === item.id)) {
      remove(this.selection, selected => selected.id === item.id);
      this.deselectItem.emit(item);
    } else {
      if (this.singleSelect) {
        this.selection.length = 0;
      }
      this.selection.push(item);
      this.selectItem.emit(item);
    }
    this.selectionChanged.emit(this.selection);
  }

  onClickLink(item: ImageThumbnailItem) {
    if (item.link) {
      window.open(item.link, item.id);
    }
  }

  isSelected(item: ImageThumbnailItem) {
    return (
      this.isSelectable &&
      find(this.selection, selected => selected.id === item.id)
    );
  }

  clearSelection() {
    this.selection.length = 0;
  }

  deleteSelection() {
    this.deleteItems.emit([...this.selection]);
  }

  onAdd() {
    this.clickAdd.emit();
  }

  onSubmit() {
    if (this.singleSelect) {
      const selected = isEmpty(this.selection) ? null : this.selection[0];
      this.dialogSubmit$.next(selected);
    } else {
      this.dialogSubmit$.next(this.selection);
    }
  }
}
