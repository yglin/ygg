import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './routes';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ]
})
export class ResourceFrontendModule { }


@NgModule({
  declarations: [],
  imports: [
    ResourceFrontendModule,
    RouterModule.forChild(routes)
  ]
})
export class ResourceFrontendFeatureModule { }
