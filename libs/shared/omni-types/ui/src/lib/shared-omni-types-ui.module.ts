import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HtmlControlComponent } from './types/html/html-control/html-control.component';
import { HtmlViewComponent } from './types/html/html-view/html-view.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CKEditorModule],
  declarations: [HtmlControlComponent, HtmlViewComponent],
  exports: [HtmlControlComponent, HtmlViewComponent]
})
export class SharedOmniTypesUiModule {}
