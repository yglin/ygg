import { Component, OnInit } from '@angular/core';
import { Box } from '@ygg/ourbox/core';
import { GeoBound } from '@ygg/shared/geography/core';
import {
  ImageThumbnailListComponent,
  YggDialogService
} from '@ygg/shared/ui/widgets';
import { BoxAgentService } from '../box/box-agent.service';
import { BoxFinderService } from '../box/box-finder.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ourbox-treasure-map',
  templateUrl: './treasure-map.component.html',
  styleUrls: ['./treasure-map.component.css']
})
export class TreasureMapComponent implements OnInit {
  boxes: Box[] = [];

  constructor(
    private boxFinder: BoxFinderService,
    private boxAgent: BoxAgentService
  ) {}

  ngOnInit(): void {}

  async onMapBoundChange(bound: GeoBound) {
    this.boxes = await this.boxFinder.findPublicBoxesInMapBound(bound);
  }

  async clickOnBoxMarker(box: Box) {
    this.boxAgent.popupTreasuresInBox(box);
  }
}
