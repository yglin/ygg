import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TestShoppingComponent } from './test/shopping/test-shopping.component';
import { AppRouteModule } from './app-route.module';
import { ShoppingCartModule } from '@ygg/shopping/cart';
import { SharedUiWidgetsModule } from '@ygg/shared/ui-widgets';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { environment } from 'apps/deep-travel/src/environments/environment';
// import { AngularFireModule } from '@angular/fire';
// import { DataAccessModule } from '@ygg/shared/data-access';

@NgModule({
  declarations: [AppComponent, TestShoppingComponent],
  imports: [
    BrowserModule,
    // DataAccessModule,
    AppRouteModule,
    ShoppingCartModule,
    SharedUiWidgetsModule
    // BrowserAnimationsModule,
    // AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
