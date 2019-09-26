import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tags } from '@ygg/tags/core';
import { TagsAdminService } from '@ygg/tags/admin';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private tagsAdminService: TagsAdminService) {}

  getOptionTags$(taggableType: string): Observable<Tags> {
    const path = `user-options/${taggableType}`;
    return this.tagsAdminService.getData$(path).pipe(
      map(tagsData => Tags.fromJSON(tagsData)),
      tap(tags => console.log(tags))
    );
  }
}
