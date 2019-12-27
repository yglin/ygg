import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';

import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { TheThingUiModule } from '@ygg/the-thing/ui';

import { RouterModule, Route } from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CellsComponent } from './pages/cell/cells/cells.component';
import { CellEditComponent } from './pages/cell/cell-edit/cell-edit.component';

const routes: Route[] = [
  { path: '', component: HomeComponent },
  {
    path: 'cells',
    children: [
      { path: '', pathMatch: 'full', component: CellsComponent },
      {
        path: 'new',
        component: CellEditComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    CellsComponent,
    CellEditComponent
  ],
  imports: [
    BrowserModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    TheThingUiModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
