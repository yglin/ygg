import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImageThumbnailItem } from '@ygg/shared/ui/widgets';
import { BoxFactoryService } from '../box/box-factory.service';
import { Subscription } from 'rxjs';
import { isEmpty, pick, values } from 'lodash';
import { AuthenticateUiService } from '@ygg/shared/user/ui';
import { pages as OurboxPages } from '@ygg/ourbox/core';
import { Page } from '@ygg/shared/ui/core';
import { LocalProfileService } from '@ygg/shared/infra/data-access';

// const links: { [key: string]: ImageThumbnailItem } = {
//   map: {
//     id: 'map-search',
//     class: 'map-search',
//     name: '撿寶地圖',
//     image: '/assets/images/map.png',
//     path: '/ourbox/map'
//   },
//   'create-box': {
//     id: 'create-box',
//     class: 'create-box',
//     name: '開新寶箱',
//     image: '/assets/images/box/create.png',
//     path: '/ourbox/create-box'
//   },
//   'my-boxes': {
//     id: 'my-boxes',
//     class: 'goto-my-boxes',
//     name: '我的寶箱',
//     image: '/assets/images/box/box.png',
//     path: '/ourbox/my-boxes'
//   },
//   'my-board': {
//     id: 'my-board',
//     class: 'goto-my-board',
//     name: '佈告欄',
//     image: '/assets/images/board.png',
//     path: '/board'
//   },
//   'site-howto': {
//     id: 'site-howto',
//     class: 'site-howto',
//     name: '如何使用本站',

//   }
// };

@Component({
  selector: 'ourbox-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  hasMyBoxes = false;

  links: { [id: string]: Page } = {};
  subscription: Subscription = new Subscription();

  constructor(
    private boxFactory: BoxFactoryService,
    private localProfileService: LocalProfileService
  ) {
    if (this.localProfileService.isFirstVisit()) {
      this.links[OurboxPages.siteHowto.id] = OurboxPages.siteHowto;
      delete this.links[OurboxPages.mapSearch.id];
    } else {
      this.links[OurboxPages.mapSearch.id] = OurboxPages.mapSearch;
      delete this.links[OurboxPages.siteHowto.id];
    }
    this.subscription.add(
      this.boxFactory.listMyBoxes$().subscribe(boxes => {
        const hasMyBoxes = !isEmpty(boxes);
        if (hasMyBoxes) {
          this.links[OurboxPages.myBoxes.id] = OurboxPages.myBoxes;
          delete this.links[OurboxPages.boxCreate.id];
        } else {
          delete this.links[OurboxPages.myBoxes.id];
          this.links[OurboxPages.boxCreate.id] = OurboxPages.boxCreate;
        }
      })
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
      this.subscription.unsubscribe();
  }
}
