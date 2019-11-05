import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedInfraLogModule } from "@ygg/shared/infra/log";
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUserModule } from '@ygg/shared/user';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';

import { PlaywhatAdminModule } from '@ygg/playwhat/admin';
import { PlaywhatPlayAdminModule, PlaywhatPlayFrontendModule } from "@ygg/playwhat/play";
import { TagsAdminModule } from "@ygg/tags/admin";

import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { routes } from './routes';
// import { SchedulerNewComponent } from './pages/scheduler/new/scheduler-new.component';
// import { SchedulerFormViewComponent } from './pages/scheduler/form/scheduler-form-view/scheduler-form-view.component';
import { SharedUiNavigationModule } from '@ygg/shared/ui/navigation';
import { ScheduleUiModule } from "@ygg/schedule/ui";
import { ScheduleAdminModule } from '@ygg/schedule/admin';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    // SchedulerNewComponent,
    // SchedulerFormViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedInfraLogModule.forRoot(),
    SharedUiNgMaterialModule,
    SharedUserModule,
    SharedUiWidgetsModule,
    SharedUiNavigationModule,
    RouterModule.forRoot(routes),
    ScheduleUiModule,
    ScheduleAdminModule,
    PlaywhatPlayFrontendModule,
    PlaywhatPlayAdminModule,
    TagsAdminModule,
    PlaywhatAdminModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
