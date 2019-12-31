import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';

import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { TheThingUiModule, TheThingCreatorComponent, TheThingViewComponent } from '@ygg/the-thing/ui';

import { RouterModule, Route } from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { CellsComponent } from './pages/cell/cells/cells.component';
// import { CellEditComponent } from './pages/cell/cell-edit/cell-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedInfraDataAccessModule } from "@ygg/shared/infra/data-access";
import { TheThingResolver } from './the-thing-resolver.service';

const routes: Route[] = [
  {
    path: 'the-things',
    children: [
      {
        path: 'create',
        component: TheThingCreatorComponent
      },
      {
        path: ':id',
        component: TheThingViewComponent,
        resolve: {
          theThing: TheThingResolver
        }
      }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    // CellsComponent,
    // CellEditComponent,
    // TheThingCreatorComponent,
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
    RouterModule.forRoot(routes),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
