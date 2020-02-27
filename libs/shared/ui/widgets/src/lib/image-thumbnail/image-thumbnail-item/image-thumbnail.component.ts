import { isEmpty } from 'lodash';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ImageThumbnailItem } from '../image-thumbnail';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'ygg-image-thumbnail',
  templateUrl: './image-thumbnail.component.html',
  styleUrls: ['./image-thumbnail.component.css']
})
export class ImageThumbnailComponent implements OnInit, OnDestroy {
  @Input() item: ImageThumbnailItem;
  @Input() item$: Observable<ImageThumbnailItem>;
  subscriptions: Subscription[] = [];

  constructor() {}

  ngOnInit() {
    if (this.item$) {
      this.subscriptions.push(this.item$.subscribe(item => this.item = item));
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  // onClick(event: MouseEvent) {
  //   if (!isEmpty(this.clicked.observers)) {
  //     event.stopPropagation();
  //     this.clicked.emit(this.item);
  //   }
  // }
}
