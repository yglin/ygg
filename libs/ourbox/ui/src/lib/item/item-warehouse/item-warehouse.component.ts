import { Component, OnInit, OnDestroy } from '@angular/core';
import { TheThing } from '@ygg/the-thing/core';
import { ItemFactoryService } from '../item-factory.service';
import { Subscription } from 'rxjs';
import { BoxFactoryService } from '../../box/box-factory.service';
import { ImitationItem } from '@ygg/ourbox/core';

@Component({
  selector: 'ourbox-item-warehouse',
  templateUrl: './item-warehouse.component.html',
  styleUrls: ['./item-warehouse.component.css']
})
export class ItemWarehouseComponent implements OnInit, OnDestroy {
  items: TheThing[] = [];
  ImitationItem = ImitationItem;
  subscription: Subscription = new Subscription();

  constructor(private boxFactory: BoxFactoryService) {
    this.subscription.add(
      this.boxFactory
        .listMyManifestItems$()
        .subscribe(items => (this.items = items))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {}
}
