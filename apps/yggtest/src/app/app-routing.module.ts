import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EcpaySendOrderComponent } from './ecpay-send-order/ecpay-send-order.component';

const routes: Routes = [
  { path: 'ecpay', children: [
    { path: 'send-order', component: EcpaySendOrderComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
