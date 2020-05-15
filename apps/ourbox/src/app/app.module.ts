import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { RouterModule } from '@angular/router';
import { routes } from './route';
import { MapComponent } from './pages/map/map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent, HomeComponent, MapComponent],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
