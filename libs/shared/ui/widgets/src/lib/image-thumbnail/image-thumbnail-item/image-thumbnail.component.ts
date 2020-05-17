import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ImageThumbnailItem } from '../image-thumbnail';

@Component({
  selector: 'ygg-image-thumbnail',
  templateUrl: './image-thumbnail.component.html',
  styleUrls: ['./image-thumbnail.component.css']
})
export class ImageThumbnailComponent implements OnInit, OnDestroy {
  @Input() item: ImageThumbnailItem;
  @Input() item$: Observable<ImageThumbnailItem>;
  @Input() size;
  subscriptions: Subscription[] = [];

  constructor() {}

  ngOnInit() {
    this.size = !!this.size ? this.size : 'medium';
    if (this.item$) {
      this.subscriptions.push(this.item$.subscribe(item => (this.item = item)));
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onClickLink(item: ImageThumbnailItem) {
    if (item.link) {
      window.open(item.link, item.id);
    }
  }

}
