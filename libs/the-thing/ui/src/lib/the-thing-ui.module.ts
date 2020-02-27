import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CellListComponent } from './cell/cell-list/cell-list.component';
import { CellFormComponent } from './cell/cell-form/cell-form.component';
import { CellControlComponent } from './cell/cell-control/cell-control.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';

import { CellViewComponent } from './cell/cell-view/cell-view.component';
import {
  TheThingEditorComponent,
  TheThingViewComponent,
  TheThingFinderComponent,
  TheThingListComponent,
  ImitationViewHostDirective,
  TheThingDataTableComponent
} from './the-thing';
import { TagsUiModule } from '@ygg/tags/ui';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { TheThingThumbnailComponent } from './the-thing/the-thing-thumbnail/the-thing-thumbnail.component';
import { MyThingsComponent } from './the-thing/my-things/my-things.component';
import { SharedUserModule } from '@ygg/shared/user';
import { TheThingFilterComponent } from './the-thing/the-thing-filter/the-thing-filter.component';
import { TheThingImitation, ImitationDog } from '@ygg/the-thing/core';
import { routes } from './routes';
import { TheThingImitationViewComponent } from './the-thing/the-thing-imitation-view/the-thing-imitation-view.component';
import { UserMenuService } from '@ygg/shared/user';
import { ImitationEditorComponent } from './imitation/imitation-editor/imitation-editor.component';
import { ImitationManagerComponent } from './imitation/imitation-manager/imitation-manager.component';
import { TheThingCellsEditorComponent } from './cell/cells-editor/cells-editor.component';
import { ImitationViewDogComponent } from './imitation/imitation-view-dog/imitation-view-dog.component';
import { TheThingImitationAccessService } from '@ygg/the-thing/data-access';

interface TheThingUiModuleConfig {
  imitations: TheThingImitation[];
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUiNgMaterialModule,
    SharedUiWidgetsModule,
    SharedUserModule,
    TagsUiModule,
    SharedOmniTypesUiModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    CellListComponent,
    CellFormComponent,
    CellControlComponent,
    CellViewComponent,
    TheThingEditorComponent,
    TheThingViewComponent,
    TheThingFinderComponent,
    TheThingListComponent,
    TheThingThumbnailComponent,
    MyThingsComponent,
    TheThingFilterComponent,
    ImitationViewHostDirective,
    TheThingImitationViewComponent,
    ImitationEditorComponent,
    ImitationManagerComponent,
    TheThingDataTableComponent,
    TheThingCellsEditorComponent,
    ImitationViewDogComponent,
  ],
  exports: [
    CellListComponent,
    CellFormComponent,
    CellControlComponent,
    CellViewComponent,
    TheThingThumbnailComponent,
    TheThingEditorComponent,
    TheThingViewComponent,
    TheThingFinderComponent,
    TheThingListComponent,
    MyThingsComponent,
    TheThingDataTableComponent,
    TheThingCellsEditorComponent
  ],
  entryComponents: [ImitationEditorComponent, TheThingFinderComponent, ImitationViewDogComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: configUserMenu,
      deps: [UserMenuService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: registerImitations,
      deps: [TheThingImitationAccessService],
      multi: true
    },
  ]
})
export class TheThingUiModule {}

export function registerImitations(imitationAccessService: TheThingImitationAccessService) {
  return () => {
    imitationAccessService.addLocal(ImitationDog);
  }
}

export function configUserMenu(userMenuService: UserMenuService) {
  return () => {
    userMenuService.addItem({
      id: 'my-things',
      label: '我的東東',
      link: 'the-things/my',
      icon: 'extension'
    });
  };
}
