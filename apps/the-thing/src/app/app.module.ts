import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';

import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import {
  TheThingUiModule,
  TheThingEditorComponent,
  TheThingViewComponent,
  MyThingsComponent,
  TheThingFinderComponent
} from '@ygg/the-thing/ui';

import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { CellsComponent } from './pages/cell/cells/cells.component';
// import { CellEditComponent } from './pages/cell/cell-edit/cell-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedInfraDataAccessModule } from '@ygg/shared/infra/data-access';
import { TheThingResolver } from '@ygg/the-thing/ui';
import { LoggedInGuard } from "@ygg/shared/user/ui";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent
    // CellsComponent,
    // CellEditComponent,
    // TheThingEditorComponent,
    // TheThingViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SharedInfraDataAccessModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    TheThingUiModule,
    RouterModule.forRoot([]),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
