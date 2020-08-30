import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { LogService } from '@ygg/shared/infra/log';
import { FireStorageService } from '@ygg/shared/infra/data-access';
import { Image } from '@ygg/shared/omni-types/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import isURL from 'validator/es/lib/isURL';
// import { distinctUntilChanged, filter } from 'rxjs/operators';

function validateImageUrl(control: FormControl) {
  const url = control.value;
  let result = null;
  if (!isURL(url)) {
    result = {
      validateImageUrl: {
        message: `${url} is not valid url`
      }
    };
  } else if (!Image.isSupportedImageExt(url)) {
    result = {
      validateImageUrl: {
        message: `${url} is not supported image extension`
      }
    };
  }

  return result;
}

@Component({
  selector: 'ygg-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent implements OnDestroy {
  imageFiles: File[] = [];
  imagesByUrl: string[] = [];
  imagesAddByUrl: string[] = [];
  isUploading: boolean = false;
  invalidUrl: boolean = false;
  imageUrlInputControl: FormControl = new FormControl('', validateImageUrl);
  subscriptions: Subscription[] = [];
  supportedImageExts = Image.SUPPORTED_IMAGE_EXT;

  // @ViewChild('imageUrlInput', { static: false }) imageUrlInput: ElementRef;

  constructor(
    private fireStorageService: FireStorageService,
    private logService: LogService,
    private dialogRef: MatDialogRef<ImageUploaderComponent>
  ) {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  addImageByUrl() {
    this.imagesAddByUrl = [this.imageUrlInputControl.value];
    this.imagesByUrl = [...this.imagesByUrl, this.imageUrlInputControl.value];
    this.imageUrlInputControl.setValue('');
    // console.log(this.imagesByUrl);
  }

  onSelectImage(imageFile) {
    this.imageFiles.push(imageFile);
  }

  onSubmit() {
    this.isUploading = true;
    this.fireStorageService
      .uploadImages(this.imageFiles)
      .subscribe(imageUrls => {
        this.isUploading = false;
        const images = this.imagesByUrl.concat(imageUrls).map(url => {
          return new Image(url);
        });
        this.dialogRef.close(images);
      });
  }
}
