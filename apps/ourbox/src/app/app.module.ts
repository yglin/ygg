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
import { BoxCreateComponent } from './pages/box/box-create/box-create.component';
import { HeaderComponent } from './layout/header/header.component';
import { SharedUserUiModule } from '@ygg/shared/user/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BoardComponent } from './pages/board/board.component';
import { BoxViewComponent } from './pages/box/box-view/box-view.component';
import { ItemViewComponent } from './pages/item/item-view/item-view.component';
import { TheThingUiModule } from '@ygg/the-thing/ui';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    MapComponent,
    BoxCreateComponent,
    BoardComponent,
    BoxViewComponent,
    ItemViewComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    SharedUserUiModule,
    TheThingUiModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
