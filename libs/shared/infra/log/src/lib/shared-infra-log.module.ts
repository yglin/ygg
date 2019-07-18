import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';

import { LogListComponent } from './log-list/log-list.component';
import { LogLevelComponent } from './log-level/log-level.component';
import { LogConfig, LogLevel } from './log';
import { LogService, LogServiceConfigToken } from './log.service';

@NgModule({
  declarations: [LogListComponent, LogLevelComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedUiNgMaterialModule
  ],
  exports: [LogListComponent]
})
export class SharedInfraLogModule {
  
  static forRoot(config?: LogConfig): ModuleWithProviders {
    if (!config) {
      config = {
        threshold: LogLevel.Warning
      };
    }
    return {
      ngModule: SharedInfraLogModule,
      providers: [
        LogService,
        {
          provide: LogServiceConfigToken,
          useValue: config
        }
      ]
    };
  }
}
