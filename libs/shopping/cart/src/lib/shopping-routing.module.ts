import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanLoad, Router, Route } from '@angular/router';
// import { OrderModule } from '@ygg/shopping/order';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
// import { OrderViewComponent } from './order/order-view/order-view.component';

const routes: Routes = [
  {
    path: 'shopping',
    children: [
      { path: '', pathMatch: 'full', component: ShoppingCartComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingRoutingModule {}
