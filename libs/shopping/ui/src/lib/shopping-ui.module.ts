import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseListComponent } from './purchase/purchase-list/purchase-list.component';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
// import { ProductThumbnailComponent } from './product/product-thumbnail/product-thumbnail.component';
// import { PurchaseThumbnailComponent } from './purchase/purchase-thumbnail/purchase-thumbnail.component';
import { ShoppingCartEditorComponent } from './cart/shopping-cart-editor/shopping-cart-editor.component';
import { FormsModule } from '@angular/forms';
import { TheThingUiModule } from '@ygg/the-thing/ui';
import { AdditionViewComponent } from './addition/addition-view/addition-view.component';
// import { PurchaseControlComponent } from './purchase/purchase-control/purchase-control.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    TheThingUiModule
  ],
  declarations: [
    PurchaseListComponent,
    // ProductThumbnailComponent,
    // PurchaseThumbnailComponent,
    ShoppingCartEditorComponent,
    AdditionViewComponent
    // PurchaseControlComponent
  ],
  exports: [
    PurchaseListComponent,
    ShoppingCartEditorComponent,
    AdditionViewComponent
    // PurchaseControlComponent
  ],
  entryComponents: [
    /* PurchaseControlComponent */
  ]
})
export class ShoppingUiModule {}
