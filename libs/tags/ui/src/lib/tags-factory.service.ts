import { Injectable } from '@angular/core';
import { TagsFactory } from '@ygg/tags/core';
import { TagsAccessorService } from './tags-accessor.service';

@Injectable({
  providedIn: 'root'
})
export class TagsFactoryService extends TagsFactory {
  constructor(
    tagsAccessor: TagsAccessorService,
  ) {
    super(tagsAccessor);
  }
}
