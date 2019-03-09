import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanLoad, Router, Route } from '@angular/router';
// import { OrderModule } from '@ygg/order';
import { ShoppingComponent } from './shopping/shopping.component';
// import { OrderViewComponent } from './order/order-view/order-view.component';

const routes: Routes = [
  {
    path: 'shopping',
    children: [
      { path: '', pathMatch: 'full', component: ShoppingComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingRoutingModule {}
