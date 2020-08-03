import { Component, OnInit } from '@angular/core';
import { ImitationPlay } from '@ygg/playwhat/core';
import { Observable } from 'rxjs';
import { TheThing, TheThingImitation } from '@ygg/the-thing/core';
import { TheThingAccessService } from '@ygg/the-thing/ui';

@Component({
  selector: 'ygg-play-admin',
  templateUrl: './play-admin.component.html',
  styleUrls: ['./play-admin.component.css']
})
export class PlayAdminComponent implements OnInit {
  imitation: TheThingImitation = ImitationPlay;
  // tourPlansByState$: { [stateName: string]: Observable<TheThing[]> } = {};
  stateConfigs: {
    name: string;
    label: string;
    theThings$: Observable<TheThing[]>;
  }[] = [];

  constructor(private theThingAccessService: TheThingAccessService) {
    this.stateConfigs = ['assess', 'forSale'].map(name => {
      const filter = this.imitation.filter.clone();
      filter.addState(
        this.imitation.stateName,
        this.imitation.states[name].value
      );
      const stateConfig = {
        name,
        label: this.imitation.states[name].label,
        theThings$: this.theThingAccessService.listByFilter$(filter)
      };
      console.log(name);
      console.log(filter);
      return stateConfig;
    });
  }

  ngOnInit() {}
}
