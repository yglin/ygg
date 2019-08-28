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
import { LocationComponent } from './location/location.component';
import { AlbumComponent } from './album/album.component';

@NgModule({
  declarations: [AppComponent, GeoPointComponent, LocationComponent, AlbumComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule.forRoot([
      { path: 'geo-point', component: GeoPointComponent },
      { path: 'location', component: LocationComponent },
      { path: 'album', component: AlbumComponent }
    ], { initialNavigation: 'enabled' }),
    SharedUiNgMaterialModule,
    SharedTypesModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
