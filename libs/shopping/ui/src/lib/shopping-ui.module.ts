import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseListComponent } from './purchase/purchase-list/purchase-list.component';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
// import { ProductThumbnailComponent } from './product/product-thumbnail/product-thumbnail.component';
// import { PurchaseThumbnailComponent } from './purchase/purchase-thumbnail/purchase-thumbnail.component';
import { ShoppingCartEditorComponent } from './cart/shopping-cart-editor/shopping-cart-editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TheThingUiModule } from '@ygg/the-thing/ui';
import { AdditionViewComponent } from './addition/addition-view/addition-view.component';
import { TheThingImitationAccessService } from '@ygg/the-thing/data-access';
import { ImitationProduct } from '@ygg/shopping/core';
import { IncomeRecordDataTableComponent } from './accounting/income-data-table/income-data-table.component';
import { SharedUserUiModule } from '@ygg/shared/user/ui';
import { RouterModule } from '@angular/router';
import { routes } from './routes';
import { PurchaseProductComponent } from './purchase/purchase-product/purchase-product.component';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { ShoppingCartButtonComponent } from './cart/shopping-cart-button/shopping-cart-button.component';
// import { PurchaseControlComponent } from './purchase/purchase-control/purchase-control.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    SharedUserUiModule,
    TheThingUiModule,
    SharedOmniTypesUiModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    PurchaseListComponent,
    // ProductThumbnailComponent,
    // PurchaseThumbnailComponent,
    ShoppingCartEditorComponent,
    AdditionViewComponent,
    IncomeRecordDataTableComponent,
    PurchaseProductComponent,
    ShoppingCartButtonComponent
    // PurchaseControlComponent
  ],
  exports: [
    PurchaseListComponent,
    ShoppingCartEditorComponent,
    AdditionViewComponent,
    IncomeRecordDataTableComponent,
    ShoppingCartButtonComponent
    // PurchaseControlComponent
  ],
  entryComponents: [
    /* PurchaseControlComponent */
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: configTheThingImitation,
      deps: [TheThingImitationAccessService],
      multi: true
    }
  ]
})
export class ShoppingUiModule {}

export function configTheThingImitation(
  imitationAccessService: TheThingImitationAccessService
) {
  return () => {
    imitationAccessService.addLocal([ImitationProduct]);
  };
}
