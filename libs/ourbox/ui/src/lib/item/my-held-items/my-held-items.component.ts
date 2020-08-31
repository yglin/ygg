import { Component, OnInit } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { ImitationItem } from '@ygg/ourbox/core';
import { Subscription } from 'rxjs';
import { BoxFactoryService } from '../../box/box-factory.service';
import { ItemFactoryService } from '../item-factory.service';

@Component({
  selector: 'ourbox-my-held-items',
  templateUrl: './my-held-items.component.html',
  styleUrls: ['./my-held-items.component.css']
})
export class MyHeldItemsComponent implements OnInit {
  items: TheThing[] = [];
  ImitationItem = ImitationItem;
  subscription: Subscription = new Subscription();

  constructor(private itemFactory: ItemFactoryService) {
    this.subscription.add(
      this.itemFactory
        .listMyHeldItems$()
        .subscribe(items => (this.items = items))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {}

}
