import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { AppRouteModule } from './app-route.module';
import { UserModule } from '@ygg/shared/user';
import { ShoppingCartModule } from '@ygg/shopping/cart';
import { SharedUiWidgetsModule } from '@ygg/shared/ui-widgets';
import { HeaderComponent } from './layout/header/header.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    // DataAccessModule,
    AppRouteModule,
    UserModule,
    ShoppingCartModule,
    SharedUiWidgetsModule
    // BrowserAnimationsModule,
    // AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
