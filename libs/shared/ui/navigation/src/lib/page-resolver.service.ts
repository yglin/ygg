import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface IPageResolverRecord {
  from: string;
  to: string;
  input?: any;
  output?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PageResolverService {
  pageRouteRecords: IPageResolverRecord[] = [];

  get top(): IPageResolverRecord {
    return this.pageRouteRecords[this.pageRouteRecords.length - 1];
  }

  constructor(private router: Router) {}

  to(to: string, input?: any) {
    this.pageRouteRecords.push({
      from: this.router.url,
      to,
      input
    });
    this.router.navigateByUrl(to);
  }

  back(output?: any) {
    this.top.output = output;
    this.router.navigateByUrl(this.top.from);
  }

  pop(): IPageResolverRecord {
    return this.pageRouteRecords.pop();
  }

  getInput(): any {
    return !!this.top ? this.top.input : null;
  }

  isPending(): boolean {
    return this.top && this.router.url === this.top.to;
  }

  isResolved(): boolean {
    return this.top && this.router.url === this.top.from;
  }
}
