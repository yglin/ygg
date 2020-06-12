import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { ImitationItem } from '@ygg/ourbox/core';
import { ItemAccessService } from '../../../item-access.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ygg-item-thumbnail',
  templateUrl: './item-thumbnail.component.html',
  styleUrls: ['./item-thumbnail.component.css']
})
export class ItemThumbnailComponent implements OnInit, OnDestroy {
  @Input() id: string;
  item: TheThing;
  subscriptions: Subscription[] = [];

  constructor(private itemAccessor: ItemAccessService) {}

  ngOnInit(): void {
    if (this.id) {
      this.subscriptions.push(
        this.itemAccessor.load$(this.id).subscribe(item => (this.item = item))
      );
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
