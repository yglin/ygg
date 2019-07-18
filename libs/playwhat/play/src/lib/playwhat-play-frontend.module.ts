import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { PlaywhatPlayModule } from './playwhat-play.module';

import { routesForLazyLoad } from "./routes";
export const routes: Route[] = [
  { path: 'plays', children : routesForLazyLoad }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PlaywhatPlayModule,
    RouterModule.forChild(routes)
  ]
})
export class PlaywhatPlayFrontendModule { }
