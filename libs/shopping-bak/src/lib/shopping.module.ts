import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShoppingButtonComponent } from './shopping-button/shopping-button.component';
import { NgMaterialModule } from './ng-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ShoppingComponent } from './shopping/shopping.component';
import { ShoppingRoutingModule } from './shopping-routing.module';
import { CartComponent } from './cart/cart/cart.component';
// import { RouterModule, Route } from '@angular/router';

import { UserModule } from '@ygg/user';
import { PaymentModule } from '@ygg/payment';
import { OrderModule } from '@ygg/order';

// export const shoppingRoutes: Route[] = [];

@NgModule({
  declarations: [ShoppingButtonComponent, ShoppingComponent, CartComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgMaterialModule,
    FlexLayoutModule,
    ShoppingRoutingModule,
    UserModule,
    OrderModule,
    PaymentModule
  ],
  exports: [ShoppingButtonComponent]
})
export class ShoppingModule {}
