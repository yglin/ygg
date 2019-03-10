import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderViewComponent } from './order/order-view/order-view.component';

@NgModule({
  imports: [
    CommonModule,

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
  declarations: [OrderViewComponent],
  exports: [OrderViewComponent]
})
export class OrderModule {}
