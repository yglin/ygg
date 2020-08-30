import { Injectable, OnDestroy } from '@angular/core';
import { ImageUploader, Image } from '@ygg/shared/omni-types/core';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { ImageUploaderComponent } from '../types/image/image-uploader/image-uploader.component';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { defaults } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ImageUploaderService extends ImageUploader implements OnDestroy {
  subscriptions: Subscription[] = [];

  constructor(private dialog: YggDialogService) {
    super();
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  async uploadImages(options: { multi?: boolean } = {}): Promise<Image[]> {
    options = defaults(options, { multi: true });
    const dialogRef = this.dialog.open(ImageUploaderComponent, {
      title: '圖片上傳',
      data: options
    });
    return dialogRef
      .afterClosed()
      .pipe(take(1))
      .toPromise();
  }
}
