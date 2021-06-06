import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CreateComponent } from './post/create/create.component';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { routes } from './routes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    SharedOmniTypesUiModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CreateComponent]
})
export class SharedPostUiModule {}
