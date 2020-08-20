import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImageThumbnailItem } from '@ygg/shared/ui/widgets';
import { BoxFactoryService } from '../../box-factory.service';
import { Subscription } from 'rxjs';
import { isEmpty, pick, values } from 'lodash';
import { Image } from '@ygg/shared/omni-types/core';
import { AuthenticateUiService } from '@ygg/shared/user/ui';
import { switchMap } from 'rxjs/operators';

const links: { [key: string]: ImageThumbnailItem } = {
  map: {
    id: 'map-search',
    class: 'map-search',
    name: '撿寶地圖',
    image: '/assets/images/map.png',
    path: '/ourbox/map'
  },
  'create-box': {
    id: 'create-box',
    class: 'create-box',
    name: '開新寶箱',
    image: '/assets/images/box/create.png',
    path: '/ourbox/create-box'
  },
  'my-boxes': {
    id: 'my-boxes',
    class: 'goto-my-boxes',
    name: '我的寶箱',
    image: '/assets/images/box/box.png',
    path: '/ourbox/my-boxes'
  },
  'my-board': {
    id: 'my-board',
    class: 'goto-my-board',
    name: '佈告欄',
    image: '/assets/images/board.png',
    path: '/board'
  }
};

@Component({
  selector: 'ygg-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  hasMyBoxes: boolean = false;

  links: ImageThumbnailItem[] = values(pick(links, ['map']));
  subscriptions: Subscription[] = [];

  constructor(
    private authenticator: AuthenticateUiService,
    private boxFactory: BoxFactoryService
  ) {
    this.subscriptions.push(
      this.authenticator.currentUser$
        .pipe(
          switchMap(user =>
            this.boxFactory.listMyBoxes$(!!user ? user.id : null)
          )
        )
        .subscribe(boxes => {
          const hasMyBoxes = !isEmpty(boxes);
          if (hasMyBoxes) {
            this.links = values(pick(links, ['map', 'my-boxes']));
          } else {
            this.links = values(pick(links, ['map', 'create-box']));
          }
        })
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
