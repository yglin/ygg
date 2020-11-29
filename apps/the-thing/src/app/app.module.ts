import { NgModule } from '@angular/core';
// import { CellsComponent } from './pages/cell/cells/cells.component';
// import { CellEditComponent } from './pages/cell/cell-edit/cell-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SharedInfraDataAccessModule } from '@ygg/shared/infra/data-access';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { TheThingUiModule } from '@ygg/the-thing/ui';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { CreateComponent } from './pages/create/create.component';
import { routes } from './route';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    CreateComponent
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
    BrowserAnimationsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
