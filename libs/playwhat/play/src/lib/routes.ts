import { Route } from "@angular/router";
import { PlayFormComponent } from './play/play-form/play-form.component';
import { PlayViewComponent } from './play/play-view/play-view.component';

export const routesForLazyLoad: Route[] = [
  { path: 'new', component: PlayFormComponent },
  { path: ':id', component: PlayViewComponent }
];