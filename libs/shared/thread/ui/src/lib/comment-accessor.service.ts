import { Injectable } from '@angular/core';
import { CommentAccessor } from '@ygg/shared/thread/core';
import { FireStoreAccessService } from "@ygg/shared/infra/data-access";

@Injectable({
  providedIn: 'root'
})
export class CommentAccessorService extends CommentAccessor {

  constructor(dataAccessor: FireStoreAccessService) {
    super(dataAccessor);
  }
}
