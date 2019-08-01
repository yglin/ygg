import { isEmpty} from "lodash";
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, throwError, of, forkJoin } from 'rxjs';
import { finalize, flatMap, catchError, last } from 'rxjs/operators';
import { v4 as uuid } from "uuid";
import { LogService } from '@ygg/shared/infra/log';

@Injectable({
  providedIn: 'root'
})
export class FireStorageService {

  constructor(
    protected storage: AngularFireStorage,
    protected logService: LogService
  ) { }

  upload(path, file): Observable<string> {
    const ref = this.storage.ref(path);
    return ref.put(file).snapshotChanges().pipe(
      last(),
      flatMap(() => ref.getDownloadURL()),
      catchError((err, caught) => {
        this.logService.error(`Failed to upload file to Google Firebase Storage: ${err}`);
        return of(err);
      })
      // catchError(this.errorService.handleAsyncError('Upload file to Google Firebase Storage'))
    );
  }

  uploadImages(imageFiles: File[]): Observable<string[]> {
    const uploadObservables: Observable<string>[] = [];
    imageFiles.forEach(imageFile => {
      const path = `images/${uuid()}`;
      uploadObservables.push(this.upload(path, imageFile));
    });
    if (isEmpty(uploadObservables)) {
      return of([]);
    } else {
      return forkJoin(uploadObservables);
    }
  }
}
