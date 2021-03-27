import { Injectable, OnDestroy } from '@angular/core';
import { OurboxHeadQuarter } from '@ygg/ourbox/core';

@Injectable({
  providedIn: 'root'
})
export class HeadQuarterService extends OurboxHeadQuarter implements OnDestroy {
  constructor() {
    super();
  }

  ngOnDestroy() {
    super.onDestroy();
  }
}
