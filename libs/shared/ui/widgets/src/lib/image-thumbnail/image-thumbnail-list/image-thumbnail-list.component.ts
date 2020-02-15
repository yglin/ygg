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
  @Output() deleteItem: EventEmitter<ImageThumbnailItem> = new EventEmitter();
  @Input() selection: ImageThumbnailItem[] = [];
  @Input() singleSelect: boolean;
  @Output() selectionChanged: EventEmitter<
    ImageThumbnailItem[]
  > = new EventEmitter();
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
        this.items$.subscribe(items => (this.items = items))
      );
    }
    this.isItemDeletable = this.deleteItem.observers.length > 0;
    this.isSelectable =
      this.selectionChanged.observers.length > 0 ||
      this.dialogSubmit$.observers.length > 0;
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
    } else {
      if (this.singleSelect) {
        this.selection.length = 0;
      }
      this.selection.push(item);
    }
    this.selectionChanged.emit(this.selection);
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

  onDeleteItem(item: ImageThumbnailItem) {
    this.deleteItem.emit(item);
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
