import { Injectable } from '@angular/core';
import { CommentFactory } from '@ygg/shared/thread/core';
import { CommentAccessorService } from './comment-accessor.service';
import { AuthenticateUiService } from '@ygg/shared/user/ui';
import { EmceeService } from '@ygg/shared/ui/widgets';

@Injectable({
  providedIn: 'root'
})
export class CommentFactoryService extends CommentFactory {
  constructor(
    commentAccessor: CommentAccessorService,
    authenticator: AuthenticateUiService,
    emcee: EmceeService
  ) {
    super(commentAccessor, authenticator, emcee);
  }
}
