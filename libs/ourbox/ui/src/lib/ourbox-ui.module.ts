import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapSearchComponent } from './map/map-search/map-search.component';
import { RouterModule } from '@angular/router';
import { routes } from './route';
import { BoxCreateComponent } from './box/box-create/box-create.component';

@NgModule({
  declarations: [MapSearchComponent, BoxCreateComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [MapSearchComponent]
})
export class OurboxUiModule {}
