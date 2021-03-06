import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderViewComponent } from './order/order-view/order-view.component';
import { OrderStateComponent } from './order/order-state/order-state.component';
import { NgMaterialModule } from './ng-material.module';
import { PurchaseListComponent } from './purchase/purchase-list/purchase-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedUserUiModule } from "@ygg/shared/user/ui";
import { DataAccessModule } from '@ygg/shared/data-access';
import { PaymentModule } from '@ygg/shopping/payment';

@NgModule({
  declarations: [OrderViewComponent, OrderStateComponent, PurchaseListComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    NgMaterialModule,
    SharedUserUiModule,
    DataAccessModule,
    PaymentModule,
    RouterModule.forChild([
      {
        path: 'orders',
        children: [
          // { path: '', pathMatch: 'full', component:  },
          { path: ':id', component: OrderViewComponent }
        ]
      }
    ])
  ],
  exports: [OrderViewComponent]
})
export class OrderModule {}
