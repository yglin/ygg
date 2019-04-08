import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedInfrastructureLogModule, LogLevel } from '@ygg/shared/infrastructure/log';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { LoggingComponent } from './logging/logging.component';

@NgModule({
  declarations: [AppComponent, LoggingComponent],
  imports: [
    BrowserModule,
    FormsModule,
    FlexLayoutModule,
    SharedUiNgMaterialModule,
    SharedInfrastructureLogModule.forRoot({
      threshold: LogLevel.Debug
    }),
    RouterModule.forRoot(
      [
        { path: 'logging', component: LoggingComponent },
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'logging'
        }
      ],
      {
        initialNavigation: 'enabled'
      }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
