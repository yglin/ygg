import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMaterialModule } from './ng-material.module';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';

@NgModule({
  declarations: [ProgressSpinnerComponent],
  imports: [CommonModule, NgMaterialModule],
  exports: [NgMaterialModule],
  entryComponents: [ProgressSpinnerComponent]
})
export class SharedUiWidgetsModule {}
