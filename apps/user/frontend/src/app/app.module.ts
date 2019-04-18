// import {CommonModule} from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgModule} from '@angular/core';
// import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
// import { RouterModule } from '@angular/router';
import {SharedUiWidgetsModule} from '@ygg/shared/ui-widgets';

import {AppComponent} from './app.component';
import {routes} from './routes';
import { UserFrontEndModule } from './user-frontend.module';

@NgModule({
  declarations: [AppComponent],
  imports: [UserFrontEndModule, SharedUiWidgetsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
