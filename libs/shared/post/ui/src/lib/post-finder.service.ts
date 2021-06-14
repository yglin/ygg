import { Injectable } from '@angular/core';
import { FireStoreAccessService } from '@ygg/shared/infra/data-access';
import { PostFinder } from '@ygg/shared/post/core';
import { TagsFinderService } from '@ygg/shared/tags/ui';
import { PostFactoryService } from './post-factory.service';

@Injectable({
  providedIn: 'root'
})
export class PostFinderService extends PostFinder {
  constructor(
    dataAccessor: FireStoreAccessService,
    postFactory: PostFactoryService,
    tagsFinder: TagsFinderService
  ) {
    super(dataAccessor, postFactory, tagsFinder);
  }
}
