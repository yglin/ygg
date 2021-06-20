import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { Observable } from 'rxjs';
import { GreetingComponent } from './greeting/greeting.component';

@Injectable({
  providedIn: 'root'
})
export class GreetingGuard implements Resolve<any> {
  constructor(private dialog: YggDialogService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    if (this.isFirstTimeVisit()) {
      this.dialog.open(GreetingComponent, {
        title: '歡迎光臨我們的藏寶圖'
      });
    }
    return true;
  }

  isFirstTimeVisit() {
    const visited = localStorage.getItem('visited');
    localStorage.setItem('visited', 'true');
    return !visited;
  }
}
