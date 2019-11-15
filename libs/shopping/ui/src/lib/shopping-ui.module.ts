import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseListComponent } from './purchase';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { ProductThumbnailComponent } from './product/product-thumbnail/product-thumbnail.component';
import { PurchaseThumbnailComponent } from './purchase/purchase-thumbnail/purchase-thumbnail.component';
import { ShoppingCartComponent } from './cart/shopping-cart/shopping-cart.component';

@NgModule({
  imports: [CommonModule, SharedUiNgMaterialModule, SharedUiWidgetsModule],
  declarations: [PurchaseListComponent, ProductThumbnailComponent, PurchaseThumbnailComponent, ShoppingCartComponent],
  exports: [PurchaseListComponent]
})
export class ShoppingUiModule {}
