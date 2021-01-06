import { Router } from '@ygg/shared/infra/core';
import { Location } from '@ygg/shared/omni-types/core';

export class Treasure {
  location: Location;

  constructor(protected router: Router) {}

  async inquireData() {
    this.router.navigate(['treasure', 'edit']);
  }
}
