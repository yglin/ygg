import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseListComponent } from './purchase';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';

@NgModule({
  imports: [CommonModule, SharedUiNgMaterialModule, SharedUiWidgetsModule],
  declarations: [PurchaseListComponent],
  exports: [PurchaseListComponent]
})
export class ShoppingUiModule {}
