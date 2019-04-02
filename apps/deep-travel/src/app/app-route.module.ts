import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // { path: '', component: TestShoppingComponent }
  // { path: 'shopping', pathMatch: 'full', loadChildren: '@ygg/shopping/cart#ShoppingCartModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouteModule {}
