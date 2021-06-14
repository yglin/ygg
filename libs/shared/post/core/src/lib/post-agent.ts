import { Router } from '@ygg/shared/infra/core';
import { Authenticator } from '@ygg/shared/user/core';

export class PostAgent {
  constructor(
    protected authenticator: Authenticator,
    protected router: Router
  ) {}

  async create(options: any = {}): Promise<void> {
    await this.authenticator.requestLogin({ message: `請先登入才能發表文章` });
    if (options.currentRoute) {
      this.router.navigate(['../create'], {
        relativeTo: options.currentRoute,
        queryParams: { tags: JSON.stringify(options.tags) }
      });
    } else {
      this.router.navigate(['../create']);
    }
  }
}
