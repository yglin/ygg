import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CreateComponent } from './post/create/create.component';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { SharedTagsUiModule } from '@ygg/shared/tags/ui';
import { routes } from './routes';
import { ViewComponent } from './post/view/view.component';
import { ListComponent } from './post/list/list.component';
import { SharedUserUiModule } from '@ygg/shared/user/ui';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    SharedUserUiModule,
    SharedOmniTypesUiModule,
    SharedTagsUiModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CreateComponent, ViewComponent, ListComponent]
})
export class SharedPostUiModule {}
