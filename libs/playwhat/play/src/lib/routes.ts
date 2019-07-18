import { Route } from "@angular/router";
import { PlayFormComponent } from './play/play-form/play-form.component';

export const routesForLazyLoad: Route[] = [
  { path: 'new', component: PlayFormComponent }
];