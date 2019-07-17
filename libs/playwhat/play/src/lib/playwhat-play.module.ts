import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { PlayTagsInputComponent } from './tag/play-tags-input/play-tags-input.component';
import { SharedTypesModule } from '@ygg/shared/types';

export const playwhatPlayRoutes: Route[] = [];

@NgModule({
  imports: [CommonModule, RouterModule, SharedTypesModule],
  declarations: [PlayTagsInputComponent],
  exports: [PlayTagsInputComponent]
})
export class PlaywhatPlayModule {}
