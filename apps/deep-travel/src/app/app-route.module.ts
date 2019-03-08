import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestShoppingComponent } from './shopping/test-shopping/test-shopping.component';

const routes: Routes = [
  { path: '', component: TestShoppingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouteModule { }
