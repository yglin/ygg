import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivateChild,
  CanActivate
} from '@angular/router';
import { Observable } from 'rxjs';
import { Size, detectWindowSize } from './screen-size';

@Injectable({
  providedIn: 'root'
})
export class BetterLargeScreenGuard implements CanActivate, CanActivateChild {
  betterSize: Size = { width: 960, height: 600 };
  canActivate(): boolean {
    return this.naggingAboutSize();
  }

  canActivateChild(): boolean {
    return this.naggingAboutSize();
  }

  naggingAboutSize(): boolean {
    const windowSize = detectWindowSize();
    if (windowSize.width < this.betterSize.width || windowSize.height < this.betterSize.height) {
      return confirm(this.getConfirmMessage());
    }
    return true;
  }

  getConfirmMessage(): string {
    return `您要前往的頁面不適合在尺寸小於 ${this.betterSize.width} X ${this.betterSize.height} 的視窗或螢幕上操作，確定要繼續嗎？`;
  }
}
