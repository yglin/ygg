import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';

import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { TheThingUiModule } from '@ygg/the-thing/ui';
import { TagsUiModule } from "@ygg/tags/ui";

import { RouterModule, Route } from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { CellsComponent } from './pages/cell/cells/cells.component';
// import { CellEditComponent } from './pages/cell/cell-edit/cell-edit.component';
import { TheThingCreatorComponent } from './pages/the-thing-creator/the-thing-creator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedInfraDataAccessModule } from "@ygg/shared/infra/data-access";

const routes: Route[] = [
  {
    path: 'the-thing',
    children: [
      {
        path: 'create',
        component: TheThingCreatorComponent
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
    TheThingCreatorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    SharedInfraDataAccessModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    TheThingUiModule,
    TagsUiModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
