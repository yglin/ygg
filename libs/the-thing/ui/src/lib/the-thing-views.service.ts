import { merge, get } from "lodash";
import { Injectable, Type } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TheThingViewsService {
  views: { [id: string]: any } = {};

  constructor() {}

  addView(id: string, view: any) {
    if (id in this.views) {
      merge(this.views[id], view);
    } else {
      this.views[id] = view;
    }
  }

  getComponent(id: string): Type<any> {
    return get(this.views, `${id}.component`, null);
  }
}
