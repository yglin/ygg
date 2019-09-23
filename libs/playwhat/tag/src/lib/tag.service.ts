import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Tags } from './tags';
import { PlaywhatAdminService } from '@ygg/playwhat/admin';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  adminPath = 'tags';

  constructor(
    private playWhatAdminService: PlaywhatAdminService
  ) { }

  getOptionTags$(taggableType: string): Observable<Tags> {
    const fullPath = `${this.adminPath}/user-options/${taggableType}`;
    return this.playWhatAdminService.getData$(fullPath).pipe(
      map(tagsData => Tags.fromJSON(tagsData))
    );
  }
}
