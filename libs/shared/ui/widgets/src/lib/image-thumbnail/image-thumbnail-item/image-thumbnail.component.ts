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

  constructor() {}

  ngOnInit() {}

  // onClick(event: MouseEvent) {
  //   if (!isEmpty(this.clicked.observers)) {
  //     event.stopPropagation();
  //     this.clicked.emit(this.item);
  //   }
  // }
}
