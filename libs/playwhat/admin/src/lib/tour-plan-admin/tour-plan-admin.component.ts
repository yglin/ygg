import { Component, OnInit } from '@angular/core';
import { ImitationTourPlan } from '@ygg/playwhat/core';
import { Observable } from 'rxjs';
import { TheThing } from '@ygg/the-thing/core';
import { TourPlanService } from "@ygg/playwhat/ui";

@Component({
  selector: 'ygg-tour-plan-admin',
  templateUrl: './tour-plan-admin.component.html',
  styleUrls: ['./tour-plan-admin.component.css']
})
export class TourPlanAdminComponent implements OnInit {
  imitationTourPlan = ImitationTourPlan;
  tourPlans$: Observable<TheThing[]>;
  
  constructor(private tourPlanService: TourPlanService) {
    this.tourPlans$ = this.tourPlanService.listInApplication$();
  }

  ngOnInit() {}
}
