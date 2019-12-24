import { isEmpty } from 'lodash';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageThumbnailItem } from '../image-thumbnail';

@Component({
  selector: 'ygg-image-thumbnail',
  templateUrl: './image-thumbnail.component.html',
  styleUrls: ['./image-thumbnail.component.css']
})
export class ImageThumbnailComponent implements OnInit {
  @Input() item: ImageThumbnailItem;
  // @Output() clicked: EventEmitter<ImageThumbnailItem> = new EventEmitter();
  imageSrc: string;

  constructor() {}

  ngOnInit() {
    if (this.item) {
      this.imageSrc =
        (this.item.album && this.item.album.cover.src) || this.item.image;
    }
  }

  // onClick(event: MouseEvent) {
  //   if (!isEmpty(this.clicked.observers)) {
  //     event.stopPropagation();
  //     this.clicked.emit(this.item);
  //   }
  // }
}
