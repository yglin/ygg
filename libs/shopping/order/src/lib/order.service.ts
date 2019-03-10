import { Injectable } from '@angular/core';
import { Contact, OrderState } from '@ygg/shared/interfaces';
import { Observable } from 'rxjs';
import { PaymentService } from '@ygg/shopping/payment';
import { DataAccessService } from '@ygg/shared/data-access';
import { map } from 'rxjs/operators';
import { Order } from './order';
import { Purchase } from './purchase/purchase';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  collection = 'orders';

  constructor(
    protected paymentService: PaymentService,
    protected dataAccessService: DataAccessService
  ) {}

  get$(id: string): Observable<Order> {
    return this.dataAccessService
      .get$(this.collection, id, Order);
  }

  upsert(order: Order): Promise<Order> {
    return this.dataAccessService
      .upsert(this.collection, order, Order);
  }

  usePayment(order: Order, paymentMethodId: string): Promise<Order> {
    return this.paymentService
      .createPayment(paymentMethodId, order.amount, order.ownerId, order.id)
      .then(payment => {
        order.paymentIds.clear();
        order.paymentIds.add(payment.id);
        return order;
      });
  }

  create(
    purchases: Purchase[],
    contact: Contact,
    paymentMethodId: string,
    ownerId: string
  ): Promise<Order> {
    const order = new Order();
    order.fromData({
      amount: Purchase.sumAmount(purchases),
      ownerId,
      contact,
      purchases
    });
    order.state = OrderState.CONFIRMED;
    return this.usePayment(order, paymentMethodId).then(_order =>
      this.upsert(_order)
    );
  }
}
