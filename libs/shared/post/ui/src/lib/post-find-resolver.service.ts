import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { wrapError } from '@ygg/shared/infra/error';
import { Post } from '@ygg/shared/post/core';
import { Observable } from 'rxjs';
import { PostFinderService } from './post-finder.service';

@Injectable({
  providedIn: 'root'
})
export class PostFindResolver implements Resolve<Post[]> {
  constructor(private postFinder: PostFinderService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Post[]> {
    const queryParams = route.queryParams;
    try {
      return this.postFinder.find(queryParams);
    } catch (error) {
      const wrpErr = wrapError(error, `找不到符合搜尋條件的文章`);
      alert(wrpErr.message);
      return Promise.reject(wrpErr);
    }
  }
}
