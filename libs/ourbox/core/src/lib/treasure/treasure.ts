import { Router } from '@ygg/shared/infra/core';
import { Album, Location } from '@ygg/shared/omni-types/core';

export class Treasure {
  name: string;
  album: Album;
  location: Location;

  constructor(protected router: Router) {}

  static forge(): Treasure {
    const treasure = new Treasure(null);
    treasure.album = Album.forge();
    treasure.name = `我的有點害羞的寶物`;
    treasure.location = Location.forge();
    return treasure;
  }

  async inquireData() {
    this.router.navigate(['treasure', 'edit']);
  }
}
