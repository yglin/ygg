import { Component, OnInit, OnDestroy } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { ItemFactoryService } from '../item-factory.service';
import { Subscription, Observable } from 'rxjs';
import { BoxFactoryService } from '../../box/box-factory.service';
import { ImitationItem } from '@ygg/ourbox/core';

@Component({
  selector: 'ourbox-item-warehouse',
  templateUrl: './item-warehouse.component.html',
  styleUrls: ['./item-warehouse.component.css']
})
export class ItemWarehouseComponent implements OnInit, OnDestroy {
  items$: Observable<TheThing[]>;
  ImitationItem = ImitationItem;
  subscription: Subscription = new Subscription();

  constructor(private boxFactory: BoxFactoryService) {
    this.items$ = this.boxFactory.listMyManifestItems$();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {}
}
