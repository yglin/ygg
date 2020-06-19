import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {
  TheThing,
  TheThingImitation,
  DisplayThumbnail
} from '@ygg/the-thing/core';
import { Album } from '@ygg/shared/omni-types/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { take } from 'rxjs/operators';
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
