import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { TheThingUiModule } from '@ygg/the-thing/ui';

import { RegisterComponent } from './pages/register/register.component';
import { AppComponent } from './app.component';

import { routes } from './routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedUserUiModule } from '@ygg/shared/user/ui';
import { HeaderComponent } from './layout/header/header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedUiNavigationModule } from '@ygg/shared/ui/navigation';

@NgModule({
  declarations: [AppComponent, RegisterComponent, HeaderComponent],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    SharedUiNavigationModule,
    SharedUserUiModule,
    TheThingUiModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
