import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedOmniTypesUiModule } from '@ygg/shared/omni-types/ui';
import { SharedThreadUiModule } from '@ygg/shared/thread/ui';
import { SharedUiNgMaterialModule } from '@ygg/shared/ui/ng-material';
import { SharedUiWidgetsModule } from '@ygg/shared/ui/widgets';
import { SharedUserUiModule } from '@ygg/shared/user/ui';
import { TagsUiModule } from '@ygg/tags/ui';
import { TheThingImitation } from '@ygg/the-thing/core';
import { CellControlComponent } from './cell/cell-control/cell-control.component';
// import {
//   TheThingEditPageComponent,
//   TheThingEditorHostDirective
// } from './the-thing/the-thing-edit-page/the-thing-edit-page.component';
import { CellCreatorComponent } from './cell/cell-creator/cell-creator.component';
import { CellFormComponent } from './cell/cell-form/cell-form.component';
import { CellListComponent } from './cell/cell-list/cell-list.component';
import { CellViewComponent } from './cell/cell-view/cell-view.component';
// import { ImitationEditorComponent } from './imitation/imitation-editor/imitation-editor.component';
// import { ImitationManagerComponent } from './imitation/imitation-manager/imitation-manager.component';
import { TheThingCellsEditorComponent } from './cell/cells-editor/cells-editor.component';
import { TheThingCellComponent } from './cell/the-thing-cell/the-thing-cell.component';
// import { ImitationViewDogComponent } from './imitation/imitation-view-dog/imitation-view-dog.component';
// import { TheThingImitationAccessService } from '@ygg/the-thing/data-access';
import { RelationsEditorComponent } from './relation/relations-editor/relations-editor.component';
import { routes } from './routes';
import {
  ImitationViewHostDirective,
  TheThingDataTableComponent,
  // TheThingEditorComponent,
  // TheThingViewComponent,
  TheThingFinderComponent,
  TheThingListComponent
} from './the-thing';
import { AdminThingsDataTableComponent } from './the-thing/admin-things-data-table/admin-things-data-table.component';
import { MyThingsDataTableComponent } from './the-thing/my-things-data-table/my-things-data-table.component';
import { MyThingsComponent } from './the-thing/my-things/my-things.component';
import { TheThingActionButtonComponent } from './the-thing/the-thing-action-button/the-thing-action-button.component';
import { TheThingFilterComponent } from './the-thing/the-thing-filter/the-thing-filter.component';
import { TheThingImitationViewComponent } from './the-thing/the-thing-imitation-view/the-thing-imitation-view.component';
import { TheThingStateComponent } from './the-thing/the-thing-state/the-thing-state.component';
import { TheThingThumbnailComponent } from './the-thing/the-thing-thumbnail/the-thing-thumbnail.component';
import { TheThingComponent } from './the-thing/the-thing/the-thing.component';
import { TheThingStateChangeRecordComponent } from './the-thing/the-thing-state-change-record/the-thing-state-change-record.component';
import { TheThingFinderItemDirective } from './the-thing/the-thing-finder/the-thing-finder.component';

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
    SharedUserUiModule,
    TagsUiModule,
    SharedOmniTypesUiModule,
    SharedThreadUiModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    CellListComponent,
    CellFormComponent,
    CellControlComponent,
    CellViewComponent,
    // TheThingEditorComponent,
    // TheThingViewComponent,
    TheThingFinderComponent,
    TheThingFinderItemDirective,
    TheThingListComponent,
    TheThingThumbnailComponent,
    MyThingsComponent,
    TheThingFilterComponent,
    ImitationViewHostDirective,
    TheThingImitationViewComponent,
    // ImitationEditorComponent,
    // ImitationManagerComponent,
    TheThingDataTableComponent,
    TheThingCellsEditorComponent,
    // ImitationViewDogComponent,
    RelationsEditorComponent,
    MyThingsDataTableComponent,
    AdminThingsDataTableComponent,
    // TheThingEditPageComponent,
    // TheThingEditorHostDirective,
    CellCreatorComponent,
    TheThingStateComponent,
    TheThingCellComponent,
    TheThingComponent,
    TheThingActionButtonComponent,
    TheThingStateChangeRecordComponent
  ],
  exports: [
    CellListComponent,
    CellFormComponent,
    CellControlComponent,
    CellViewComponent,
    TheThingThumbnailComponent,
    // TheThingEditorComponent,
    // TheThingViewComponent,
    TheThingFinderComponent,
    TheThingListComponent,
    MyThingsComponent,
    TheThingDataTableComponent,
    TheThingCellsEditorComponent,
    RelationsEditorComponent,
    MyThingsDataTableComponent,
    AdminThingsDataTableComponent,
    CellCreatorComponent,
    TheThingStateComponent,
    TheThingCellComponent,
    TheThingComponent
  ],
  providers: [
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: configUserMenu,
    //   deps: [UserMenuService],
    //   multi: true
    // },
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: registerImitations,
    //   deps: [TheThingImitationAccessService],
    //   multi: true
    // }
  ]
})
export class TheThingUiModule {}

// export function registerImitations(
//   imitationAccessService: TheThingImitationAccessService
// ) {
//   return () => {
//     imitationAccessService.addLocal(ImitationDog);
//   };
// }

// export function configUserMenu(userMenuService: UserMenuService) {
//   return () => {
//     userMenuService.addItem({
//       id: 'my-things',
//       label: '我的東東',
//       link: 'the-things/my',
//       icon: 'extension'
//     });
//   };
// }
