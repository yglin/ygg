import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { wrapError } from '@ygg/shared/infra/error';
import { Post } from '@ygg/shared/post/core';
import { PostFinderService } from './post-finder.service';

@Injectable({
  providedIn: 'root'
})
export class PostResolver implements Resolve<Post> {
  constructor(private postFinder: PostFinderService) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Post> {
    const id = route.paramMap.get('id');
    try {
      return this.postFinder.getById(id);
    } catch (error) {
      const wrpErr = wrapError(error, `找不到文章 ${id}`);
      alert(wrpErr.message);
      return Promise.reject(wrpErr);
    }
  }
}
