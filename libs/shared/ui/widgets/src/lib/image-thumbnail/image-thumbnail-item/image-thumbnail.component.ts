import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ImageThumbnailItem } from '../image-thumbnail';
import { Router } from '@angular/router';
import { ImageThumbnailItemSize } from './image-thumbnail.component.po';

@Component({
  selector: 'ygg-image-thumbnail',
  templateUrl: './image-thumbnail.component.html',
  styleUrls: ['./image-thumbnail.component.css']
})
export class ImageThumbnailComponent implements OnInit, OnDestroy {
  @Input() item: ImageThumbnailItem;
  @Input() item$: Observable<ImageThumbnailItem>;
  @Input() size: ImageThumbnailItemSize;
  subscriptions: Subscription[] = [];

  constructor(private router: Router) {}

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
      // window.open(item.link, item.id);
      this.router.navigateByUrl(item.link);
    }
  }
}
