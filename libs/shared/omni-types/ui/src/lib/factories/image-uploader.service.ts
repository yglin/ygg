import { Injectable, OnDestroy } from '@angular/core';
import { ImageUploader, Image } from '@ygg/shared/omni-types/core';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { ImageUploaderComponent } from '../types/image/image-uploader/image-uploader.component';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

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

  async uploadImages(): Promise<Image[]> {
    const dialogRef = this.dialog.open(ImageUploaderComponent, {
      title: '圖片上傳'
    });
    return dialogRef
      .afterClosed()
      .pipe(take(1))
      .toPromise();
  }
}
