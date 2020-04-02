import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShoppingButtonComponent } from './shopping-button/shopping-button.component';
import { NgMaterialModule } from './ng-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ShoppingRoutingModule } from './shopping-routing.module';
import { CartComponent } from './cart/cart.component';
// import { RouterModule, Route } from '@angular/router';

import { SharedUserUiModule } from "@ygg/shared/user/ui";
import { PaymentModule } from '@ygg/shopping/payment';
import { OrderModule } from '@ygg/shopping/order';

// export const shoppingRoutes: Route[] = [];

@NgModule({
  declarations: [ShoppingButtonComponent, ShoppingCartComponent, CartComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgMaterialModule,
    FlexLayoutModule,
    SharedUserUiModule,
    OrderModule,
    PaymentModule,
    ShoppingRoutingModule
  ],
  exports: [ShoppingButtonComponent]
})
export class ShoppingCartModule {}
