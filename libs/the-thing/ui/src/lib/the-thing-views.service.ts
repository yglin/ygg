import { merge, get } from 'lodash';
import { Injectable, Type } from '@angular/core';
import { TheThingView } from '@ygg/the-thing/core';

@Injectable({
  providedIn: 'root'
})
export class TheThingViewsService {
  views: { [id: string]: TheThingView } = {};

  constructor() {}

  addView(id: string, view: TheThingView) {
    if (id in this.views) {
      merge(this.views[id], view);
    } else {
      this.views[id] = view;
    }
    // console.dir(this.views);
  }

  getComponent(id: string): Type<any> {
    return get(this.views, `${id}.component`, null);
  }
}
