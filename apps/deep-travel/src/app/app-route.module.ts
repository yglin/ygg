import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestShoppingComponent } from './shopping/test-shopping/test-shopping.component';

const routes: Routes = [
  { path: '', component: TestShoppingComponent }
  // { path: 'shopping', pathMatch: 'full', loadChildren: '@ygg/shopping/cart#ShoppingCartModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouteModule {}
