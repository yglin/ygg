import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUserModule } from "@ygg/shared/user";
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets'

import { PlaywhatSchedulerModule } from '@ygg/playwhat/scheduler';

import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { routes } from './routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SchedulerNewComponent } from './pages/scheduler/new/scheduler-new.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, HomeComponent, SchedulerNewComponent],
  imports: [
    BrowserModule,
    SharedUiNgMaterialModule,
    SharedUserModule,
    SharedUiWidgetsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    PlaywhatSchedulerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
