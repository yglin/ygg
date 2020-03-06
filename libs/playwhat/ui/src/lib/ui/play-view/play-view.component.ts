import { Component, OnInit, Input } from '@angular/core';
import { TheThingImitationViewInterface } from '@ygg/the-thing/ui';
import { TheThing } from '@ygg/the-thing/core';
import { RelationAddition } from '@ygg/shopping/core';
import { TheThingAccessService } from '@ygg/the-thing/data-access';
import { isEmpty } from 'lodash';

@Component({
  selector: 'ygg-play-view',
  templateUrl: './play-view.component.html',
  styleUrls: ['./play-view.component.css']
})
export class PlayViewComponent
  implements OnInit, TheThingImitationViewInterface {
  @Input() theThing: TheThing;
  RelationAddition = RelationAddition;
  additions: TheThing[];

  constructor(private theThingAccessService: TheThingAccessService) {}

  ngOnInit() {
    if (this.theThing && this.theThing.hasRelation(RelationAddition.name)) {
      this.theThingAccessService
        .listByIds$(this.theThing.getRelationObjectIds(RelationAddition.name))
        .subscribe(
          additions =>
            (this.additions = isEmpty(additions) ? undefined : additions)
        );
    }
  }
}
