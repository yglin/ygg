import { noop, isEmpty } from 'lodash';
import { Component, forwardRef, OnDestroy, Input } from '@angular/core';
import { Album } from '../album';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ImageUploaderComponent } from '../../image/image-uploader/image-uploader.component';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ygg-album-control',
  templateUrl: './album-control.component.html',
  styleUrls: ['./album-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AlbumControlComponent),
      multi: true
    }
  ]
})
export class AlbumControlComponent implements ControlValueAccessor, OnDestroy {
  @Input() label: string;
  _album: Album;
  set album(value: Album) {
    if (value) {
      this._album = value;
      if (this.emitChange) {
        this.emitChange(this._album);
      }
    }
  }
  get album(): Album {
    return this._album;
  }

  emitChange: (value: Album) => any = noop;
  imageUrl: string;
  subscriptions: Subscription[] = [];

  constructor(protected yggDialog: YggDialogService) {
    this.album = new Album();
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(value: Album) {
    if (value) {
      this._album = value;
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched(fn) {}

  setCover(index) {
    this.album.cover = this.album.photos[index];
    this.emitChange(this.album);
  }

  onClickPhoto(index) {
    this.setCover(index);
  }

  deletePhoto(index) {
    if (confirm('確定刪除這張照片？')) {
      this.album.photos.splice(index, 1);
      this.emitChange(this.album);
    }
  }

  addPhoto() {
    const dialogRef = this.yggDialog.open(ImageUploaderComponent, {
      title: '圖片上傳'
    });
    this.subscriptions.push(
      dialogRef.afterClosed().subscribe(images => {
        if (!isEmpty(images)) {
          this.album.photos.push(...images);
          this.emitChange(this.album);
        }
      })
    );
  }
}
