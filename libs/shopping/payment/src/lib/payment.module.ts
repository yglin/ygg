import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgMaterialModule } from './ng-material.module';
import { PaymentMethodSelectorComponent } from './payment-method/payment-method-selector/payment-method-selector.component';

@NgModule({
  imports: [CommonModule, FormsModule, FlexLayoutModule, NgMaterialModule],
  declarations: [PaymentMethodSelectorComponent],
  exports: [PaymentMethodSelectorComponent]
})
export class PaymentModule {}
