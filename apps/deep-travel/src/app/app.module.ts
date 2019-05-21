import {LOCALE_ID, NgModule} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localeDataZhHant from '@angular/common/locales/zh-Hant';
import {FlexLayoutModule} from '@angular/flex-layout'
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {SchedulerFeatureModule} from '@ygg/apps/scheudler';
import {UserFrontEndFeatureModule} from '@ygg/apps/user/frontend';
import {SharedUiNgMaterialModule} from '@ygg/shared/ui/ng-material';

import {AppComponent} from './app.component';
import {HeaderComponent} from './layout/header/header.component';
import {routes} from './routes';

registerLocaleData(localeDataZhHant);

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule, FlexLayoutModule, SharedUiNgMaterialModule,
    UserFrontEndFeatureModule, SchedulerFeatureModule,
    RouterModule.forRoot(routes)
    // DataAccessModule,
    // BrowserAnimationsModule,
    // AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [{provide: LOCALE_ID, useValue: 'zh-Hant'}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
