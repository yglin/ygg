import { isEmpty } from 'lodash';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  EventEmitter,
  OnDestroy,
  SimpleChanges,
  Output,
  ViewChild
} from '@angular/core';
import { Album, Image } from '@ygg/shared/omni-types/core';
import { fromEvent, Subscription } from 'rxjs';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { ImageUploaderComponent } from '../image/image-uploader/image-uploader.component';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ygg-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('tooltipHintInit', { static: false }) tooltipHintInit: MatTooltip;
  @Input() album: Album;
  @Input() readonly: boolean;
  @Input() hints: any = {};
  @Output() albumChanged: EventEmitter<Album> = new EventEmitter();
  fxLayout = 'row wrap';
  subscriptions: Subscription[] = [];
  initHint = false;
  noImageSrc =
    'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

  get coverSrc(): string {
    return (
      (this.album && this.album.cover && this.album.cover.src) ||
      this.noImageSrc
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

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    if (this.hints.init) {
      this.tooltipHintInit.show();
      this.initHint = true;
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
    this.initHint = false;
    this.tooltipHintInit.hide();
  }

  clearAll() {
    if (confirm(`確定要清空所有照片?`)) {
      this.album.clear();
    }
  }
}
