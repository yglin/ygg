import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';

@NgModule({
  declarations: [ProgressSpinnerComponent],
  imports: [CommonModule, SharedUiNgMaterialModule],
  exports: [SharedUiNgMaterialModule],
  entryComponents: [ProgressSpinnerComponent]
})
export class SharedUiWidgetsModule {}
