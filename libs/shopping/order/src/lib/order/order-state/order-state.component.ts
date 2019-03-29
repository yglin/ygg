import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { OrderState } from '@ygg/shared/interfaces';

@Component({
  selector: 'ygg-order-state',
  templateUrl: './order-state.component.html',
  styleUrls: ['./order-state.component.css']
})
export class OrderStateComponent implements OnInit, OnChanges {
  @Input() state: OrderState;
  stateMessage = '';

  constructor(
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    switch (this.state) {
      case OrderState.NEW:
        this.stateMessage = '新訂單，等待確認';
        break;
      case OrderState.CONFIRMED:
        this.stateMessage = '等待付款中';
        break;
      case OrderState.PAID:
        this.stateMessage = '已付款完成，等待品項交付或活動開始';
        break;
      case OrderState.COMPLETED:
        this.stateMessage = '已完成，所有品項已交付或活動結束';
        break;
      case OrderState.CANCELED:
        this.stateMessage = '已取消';
        break;
      case OrderState.REFUNDING:
        this.stateMessage = '等待退款給買家';
        break;
      case OrderState.REFUNDED:
        this.stateMessage = '已退款完成'
        break;
      default:
        this.stateMessage = '訂單狀態錯誤，請聯絡管理者';
        break;
    }
  }

}
