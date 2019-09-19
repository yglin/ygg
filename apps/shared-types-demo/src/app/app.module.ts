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
import { TagsComponent } from './tags/tags.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { ChipsControlDemoComponent } from './chips-control/chips-control.component';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';

@NgModule({
  declarations: [AppComponent, GeoPointComponent, LocationComponent, AlbumComponent, TagsComponent, GoogleMapComponent, ChipsControlDemoComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    RouterModule.forRoot([
      { path: 'geo-point', component: GeoPointComponent },
      { path: 'location', component: LocationComponent },
      { path: 'google-map', component: GoogleMapComponent },
      { path: 'album', component: AlbumComponent },
      { path: 'tags', component: TagsComponent },
      { path: 'chips-control', component: ChipsControlDemoComponent },
    ], { initialNavigation: 'enabled' }),
    SharedUiNgMaterialModule,
    SharedTypesModule,
    SharedUiWidgetsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
