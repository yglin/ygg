import { Injectable, OnDestroy } from '@angular/core';
import { HeadQuarter } from '@ygg/shared/infra/core';

@Injectable({
  providedIn: 'root'
})
export class HeadQuarterService extends HeadQuarter implements OnDestroy {
  constructor() {
    super();
  }

  ngOnDestroy() {
    super.onDestroy();
  }
}
