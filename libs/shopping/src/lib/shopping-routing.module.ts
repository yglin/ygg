import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShoppingComponent } from './shopping/shopping.component';
// import { OrderViewComponent } from './order/order-view/order-view.component';

const routes: Routes = [
  {
    path: 'shopping',
    children: [
      { path: '', pathMatch: 'full', component: ShoppingComponent },
      // {
      //   path: 'orders',
      //   children: [
      //     { path: ':id', component: OrderViewComponent }
      //   ]
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingRoutingModule { }
