import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { CellNames, Purchase } from '@ygg/shopping/core';
import { TheThingAccessService } from '@ygg/the-thing/ui';
import { sumBy } from 'lodash';
// import { ShoppingCartService } from '@ygg/shopping/factory';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ygg-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css']
})
export class PurchaseListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() purchases: Purchase[];
  totalPrice = 0;
  CellNames = CellNames;
  subscriptions: Subscription[] = [];

  constructor(private theThingAccessService: TheThingAccessService) {}

  ngOnInit() {}

  evalTotalPrice() {
    this.totalPrice = sumBy(this.purchases, purchase => purchase.charge);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.evalTotalPrice();
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
