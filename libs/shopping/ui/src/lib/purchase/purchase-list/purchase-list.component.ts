import { isEmpty, sumBy, sum } from 'lodash';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { Purchase, CellNameQuantity, CellNameCharge } from '@ygg/shopping/core';
// import { ShoppingCartService } from '@ygg/shopping/factory';
import { Subscription, Observable, of, BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { TheThingRelation } from '@ygg/the-thing/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';

@Component({
  selector: 'ygg-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css']
})
export class PurchaseListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() purchases: Purchase[];
  totalPrice = 0;
  CellNameQuantity = CellNameQuantity;
  subscriptions: Subscription[] = [];

  constructor(private theThingAccessService: TheThingAccessService) {}

  ngOnInit() {}

  evalTotalPrice() {
    this.totalPrice = sumBy(
      this.purchases,
      purchase => purchase.charge
    );
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
