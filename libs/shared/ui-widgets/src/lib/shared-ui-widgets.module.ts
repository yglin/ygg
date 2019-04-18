import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { PageTitleComponent } from './page-title/page-title.component';
import { IMaybeALinkDirective } from './i-maybe-a-link/i-maybe-a-link.directive';

@NgModule({
  declarations: [ProgressSpinnerComponent, PageTitleComponent, IMaybeALinkDirective],
  imports: [CommonModule, SharedUiNgMaterialModule, FlexLayoutModule],
  exports: [SharedUiNgMaterialModule, FlexLayoutModule, PageTitleComponent, IMaybeALinkDirective],
  entryComponents: [ProgressSpinnerComponent]
})
export class SharedUiWidgetsModule {}
