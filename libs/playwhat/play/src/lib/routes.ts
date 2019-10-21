import { Route } from "@angular/router";
import { PlayFormComponent } from './play/play-form/play-form.component';
import { PlayViewComponent } from './play/play-view/play-view.component';
import { PlayEditPageComponent } from './pages/play-edit-page/play-edit-page.component';

export const routesForLazyLoad: Route[] = [
  { path: 'new', component: PlayEditPageComponent },
  { path: ':id', component: PlayViewComponent }
];