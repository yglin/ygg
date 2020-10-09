import { Injectable } from '@angular/core';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { Tags, TagsStory } from '@ygg/tags/core';
import { take } from 'rxjs/operators';
import { TagsControlComponent } from './tags-control/tags-control.component';

@Injectable({
  providedIn: 'root'
})
export class TagsStoryService extends TagsStory {
  constructor(private dialog: YggDialogService) {
    super();
  }

  async editTags(tags: Tags): Promise<Tags> {
    const dialogRef = this.dialog.open(TagsControlComponent, {
      title: '編輯標籤',
      data: {
        tags: tags
      }
    });
    return dialogRef
      .afterClosed()
      .pipe(
        take(1)
        // tap(_tags => {
        //   console.log('TagsFactory.editTags');
        //   console.log(_tags);
        // })
      )
      .toPromise();
  }
}
