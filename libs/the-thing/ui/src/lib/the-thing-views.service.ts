import { merge, get } from 'lodash';
import { Injectable, Type } from '@angular/core';
import { TheThingView } from '@ygg/the-thing/core';
import { ImitationViewDogComponent } from './imitation';

@Injectable({
  providedIn: 'root'
})
export class TheThingViewsService {
  views: { [id: string]: TheThingView } = {
    'dog': {
      id: 'dog',
      label: '狗狗',
      component: ImitationViewDogComponent
    }
  };

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
    // console.log(id);
    // console.dir(this.views);
    return get(this.views, `${id}.component`, null);
  }
}