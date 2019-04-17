import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgMaterialModule } from './ng-material.module';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { IMaybeALinkDirective } from './i-maybe-a-link/i-maybe-a-link.directive';

@NgModule({
  declarations: [ProgressSpinnerComponent, PageTitleComponent, IMaybeALinkDirective],
  imports: [CommonModule, NgMaterialModule, FlexLayoutModule],
  exports: [NgMaterialModule, FlexLayoutModule, PageTitleComponent, IMaybeALinkDirective],
  entryComponents: [ProgressSpinnerComponent]
})
export class SharedUiWidgetsModule {}
