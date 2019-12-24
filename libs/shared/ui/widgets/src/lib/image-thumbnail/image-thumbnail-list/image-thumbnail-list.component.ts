import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageThumbnailItem } from '../image-thumbnail';

@Component({
  selector: 'ygg-image-thumbnail-list',
  templateUrl: './image-thumbnail-list.component.html',
  styleUrls: ['./image-thumbnail-list.component.css']
})
export class ImageThumbnailListComponent implements OnInit {
  @Input() items: ImageThumbnailItem[];
  @Input() readonly;
  @Output() clickItem: EventEmitter<ImageThumbnailItem> = new EventEmitter();
  @Output() clickAdd: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    this.readonly = this.readonly !== undefined && this.readonly !== false && this.readonly !== 'false';
  }

  onClickItem(item: ImageThumbnailItem) {
    this.clickItem.emit(item);
  }

  onAdd() {
    this.clickAdd.emit();
  }
}
