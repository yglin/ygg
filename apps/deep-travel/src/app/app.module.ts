import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout'
import { SharedUiNgMaterialModule } from "@ygg/shared/ui/ng-material";

import { UserFrontEndFeatureModule } from "@ygg/apps/user/frontend";
import { SchedulerFeatureModule } from '@ygg/apps/scheudler';

import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { routes } from './routes';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    SharedUiNgMaterialModule,
    UserFrontEndFeatureModule,
    SchedulerFeatureModule,
    RouterModule.forRoot(routes)
    // DataAccessModule,
    // BrowserAnimationsModule,
    // AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
