import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';

import { AppComponent } from './app.component';
import { DialogsComponent } from './dialogs/dialogs.component';
import { DialogSampleContentComponent } from './dialogs/sample-content/sample-content.component';
import { routes } from './routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { TestControlComponent } from './test-control/test-control.component';

@NgModule({
  declarations: [
    AppComponent,
    DialogsComponent,
    DialogSampleContentComponent,
    TestControlComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedUiNgMaterialModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    SharedUiWidgetsModule
  ],
  entryComponents: [DialogSampleContentComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
