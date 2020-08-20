import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapSearchComponent } from './map/map-search/map-search.component';
import { RouterModule } from '@angular/router';
import { routes } from './route';
import { BoxCreateComponent } from './box/box-create/box-create.component';
import { MyBoxesComponent } from './box/my-boxes/my-boxes.component';

@NgModule({
  declarations: [MapSearchComponent, BoxCreateComponent, MyBoxesComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [MapSearchComponent]
})
export class OurboxUiModule {}
