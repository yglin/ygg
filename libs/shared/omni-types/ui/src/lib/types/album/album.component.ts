import { isEmpty } from 'lodash';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  EventEmitter,
  OnDestroy,
  SimpleChanges,
  Output
} from '@angular/core';
import { Album, Image } from '@ygg/shared/omni-types/core';
import { fromEvent, Subscription } from 'rxjs';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { ImageUploaderComponent } from '../image/image-uploader/image-uploader.component';

@Component({
  selector: 'ygg-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit, OnDestroy, OnChanges {
  @Input() album: Album;
  @Input() readonly: boolean;
  @Output() albumChanged: EventEmitter<Album> = new EventEmitter();
  fxLayout = 'row wrap';
  subscriptions: Subscription[] = [];

  get coverSrc(): string {
    return (
      (this.album && this.album.cover && this.album.cover.src) || 
      Image.DEFAULT_IMAGE_SRC
    );
  }

  constructor(protected yggDialog: YggDialogService) {
    this.subscriptions.push(
      fromEvent(window, 'resize').subscribe(() => {
        this.fxLayout = window.innerWidth >= 960 ? 'row' : 'column';
      })
    );
  }

  ngOnInit() {
    this.readonly = this.readonly !== undefined && this.readonly !== false;
    if (this.album && this.readonly) {
      this.album = this.album.clone();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('Input album change!!')
    if (changes.album.currentValue) {
      const newAlbum: Album = changes.album.currentValue;
      if (this.readonly) {
        this.album = newAlbum.clone();
      } else {
        this.album = newAlbum;
      }
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  setCover(index) {
    this.album.cover = this.album.photos[index];
    this.albumChanged.emit(this.album);
  }

  deletePhoto(index) {
    if (confirm('確定刪除這張照片？')) {
      this.album.deletePhoto(index);
      this.albumChanged.emit(this.album);
    }
  }

  addPhoto() {
    const dialogRef = this.yggDialog.open(ImageUploaderComponent, {
      title: '圖片上傳'
    });
    this.subscriptions.push(
      dialogRef.afterClosed().subscribe(images => {
        if (!isEmpty(images)) {
          this.album.addPhotos(images);
          this.albumChanged.emit(this.album);
        }
      })
    );
  }

  clearAll() {
    if (confirm(`確定要清空所有照片?`)) {
      this.album.clear();
    }
  }
}
