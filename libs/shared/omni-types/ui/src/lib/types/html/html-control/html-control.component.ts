import { noop } from 'lodash';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  SecurityContext,
  forwardRef
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Html } from '@ygg/shared/omni-types/core';
import { FormControl } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { FireStorageService } from '@ygg/shared/infra/data-access';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AngularFireUploadTask } from '@angular/fire/storage';

interface CKEditorImageResponse {
  [size: string]: string;
}

class YggUploadAdapter {
  // CKEditor FileLoader
  loader: any;
  uploadService: FireStorageService;
  uploadTask: AngularFireUploadTask;

  constructor(loader: any, uploadService: FireStorageService) {
    this.loader = loader;
    this.uploadService = uploadService;
  }

  async upload(): Promise<CKEditorImageResponse> {
    return this.loader.file.then(file => {
      this.uploadTask = this.uploadService.uploadImageTask(file);
      let ref: any;
      return new Promise((resolve, reject) => {
        this.uploadTask
          .snapshotChanges()
          .pipe(
            tap(taskSnapshot => {
              ref = taskSnapshot.ref;
              this.loader.uploadTotal = taskSnapshot.totalBytes;
              this.loader.uploaded = taskSnapshot.bytesTransferred;
            }),
            finalize(() => {
              if (ref) {
                ref.getDownloadURL().then(url => {
                  resolve({ default: url });
                });
              } else {
                throw new Error('No upload file reference');
              }
            }),
            catchError(error => {
              const errMsg = `上傳失敗，錯誤原因：${error.message}`;
              alert(errMsg);
              reject(new Error(errMsg));
              return of(null);
            })
          )
          .subscribe();
      });
    });
  }

  abort() {
    if (this.uploadTask) {
      this.uploadTask.cancel();
    }
  }
}

@Component({
  selector: 'ygg-html-control',
  templateUrl: './html-control.component.html',
  styleUrls: ['./html-control.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HtmlControlComponent),
      multi: true
    }
  ]
})
export class HtmlControlComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() label: string;
  editor: any = ClassicEditor;
  config: any = {};
  formControlContent: FormControl;
  emitChange: (value: Html) => any = noop;
  emitTouched: () => any = noop;
  subscriptions: Subscription[] = [];

  constructor(
    private domSanitizer: DomSanitizer,
    private fireStorgeService: FireStorageService
  ) {
    this.formControlContent = new FormControl('');
    this.subscriptions.push(
      this.formControlContent.valueChanges.subscribe(value => {
        const html = new Html(
          domSanitizer.sanitize(SecurityContext.HTML, value)
        );
        this.emitChange(html);
      })
    );
    this.config = {
      placeholder: '從這裡開始編輯',
      extraPlugins: [editor => this.UploadAdapterPlugin(editor)]
    };
  }

  // onReady(editor) {
  //   editor.ui
  //     .getEditableElement()
  //     .parentElement.insertBefore(
  //       editor.ui.view.toolbar.element,
  //       editor.ui.getEditableElement()
  //     );
  // }

  ngOnInit() {}

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  writeValue(value: Html) {
    if (Html.isHtml(value)) {
      this.formControlContent.setValue(value.content);
    } else if (typeof value === 'string') {
      this.formControlContent.setValue(value);
    } else {
      this.formControlContent.setValue('');
    }
  }

  registerOnChange(fn) {
    this.emitChange = fn;
  }

  registerOnTouched(fn) {
    this.emitTouched = fn;
  }

  UploadAdapterPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = loader => {
      // Configure the URL to the upload script in your back-end here!
      return new YggUploadAdapter(loader, this.fireStorgeService);
    };
  }
}
