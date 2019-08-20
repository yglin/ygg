import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SharedTypesModule } from "@ygg/shared/types";
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { GeoPointComponent } from './geo-point/geo-point.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent, GeoPointComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule.forRoot([
      { path: 'geo-point', component: GeoPointComponent }
    ], { initialNavigation: 'enabled' }),
    SharedUiNgMaterialModule,
    SharedTypesModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
