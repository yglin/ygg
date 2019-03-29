import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Order } from '../../order';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../order.service';

@Component({
  selector: 'ygg-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css']
})
export class OrderViewComponent implements OnInit {
  @Input() id: string;
  order: Order;
  paymentIds: string[];

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected orderService: OrderService,
    protected zone: NgZone
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!this.id && id) {
      this.id = id;
    } else {
      alert(`找不到訂單, ID=${this.id}`);
      this.router.navigate(['home']);
    }
    if (this.id) {
      this.orderService.get$(this.id).subscribe(order => {
        // this.zone.run(() => {
          this.order = order;
          this.paymentIds = Array.from(order.paymentIds);
        // });
      });
    }
  }
}
