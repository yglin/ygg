import { Component, OnInit } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { ImitationItem } from '@ygg/ourbox/core';
import { Subscription, Observable } from 'rxjs';
import { BoxFactoryService } from '../../box/box-factory.service';
import { ItemFactoryService } from '../item-factory.service';

@Component({
  selector: 'ourbox-my-held-items',
  templateUrl: './my-held-items.component.html',
  styleUrls: ['./my-held-items.component.css']
})
export class MyHeldItemsComponent implements OnInit {
  items$: Observable<TheThing[]>;
  ImitationItem = ImitationItem;
  subscription: Subscription = new Subscription();

  constructor(private itemFactory: ItemFactoryService) {
    this.items$ = this.itemFactory.listMyHeldItems$();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {}
}
