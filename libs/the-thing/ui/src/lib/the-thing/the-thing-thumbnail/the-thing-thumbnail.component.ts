import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ImageThumbnailItemSize } from '@ygg/shared/ui/widgets';
import {
  DisplayThumbnail,
  TheThing,
  TheThingImitation
} from '@ygg/the-thing/core';
import { get } from 'lodash';
import { Subscription } from 'rxjs';
import { TheThingFactoryService } from '../../the-thing-factory.service';

@Component({
  selector: 'the-thing-thumbnail',
  templateUrl: './the-thing-thumbnail.component.html',
  styleUrls: ['./the-thing-thumbnail.component.css']
})
export class TheThingThumbnailComponent implements OnInit, OnDestroy {
  @Input() imitation: TheThingImitation;
  @Input() theThing: TheThing;
  @Input() id: string;
  @Input() size: ImageThumbnailItemSize;
  display: DisplayThumbnail;
  subscriptions: Subscription[] = [];

  constructor(private theThingFactory: TheThingFactoryService) {}

  ngOnInit() {
    let collection = TheThing.collection;
    if (this.imitation) {
      this.display = get(this.imitation, 'displays.thumbnail', null);
      // console.log(this.display);
      if (this.imitation.collection) {
        collection = this.imitation.collection;
      }
    }
    if (!this.theThing) {
      if (this.id) {
        // console.log(`the-thing-thumbnail: ${this.id}`);
        this.subscriptions.push(
          this.theThingFactory
            .load$(this.id, collection)
            .subscribe(theThing => {
              this.theThing = theThing;
              // console.log(this.theThing);
            })
        );
      }
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
