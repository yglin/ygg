import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgMaterialModule } from './ng-material.module';
import { PaymentMethodSelectorComponent } from './payment-method/payment-method-selector/payment-method-selector.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentEcpayComponent } from './payment/payment-ecpay/payment-ecpay.component';
import { PaymentUnderTableComponent } from './payment/payment-under-table/payment-under-table.component';
import { HttpClientModule } from '@angular/common/http';
import { DataAccessModule } from '@ygg/shared/data-access';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    NgMaterialModule,
    HttpClientModule,
    DataAccessModule
  ],
  declarations: [
    PaymentMethodSelectorComponent,
    PaymentComponent,
    PaymentEcpayComponent,
    PaymentUnderTableComponent
  ],
  exports: [PaymentMethodSelectorComponent, PaymentComponent]
})
export class PaymentModule {}
