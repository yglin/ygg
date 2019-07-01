import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedUiNavigationModule } from '@ygg/shared/ui/navigation';

import { routes } from './routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedUiNavigationModule,
    RouterModule.forChild(routes)
  ],
  declarations: [],
  exports: []
})
export class PlaywhatAdminModule {}
