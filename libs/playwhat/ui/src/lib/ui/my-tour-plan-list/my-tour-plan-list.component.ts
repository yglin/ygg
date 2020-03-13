import { Component, OnInit } from '@angular/core';
import { ImitationTourPlan } from '@ygg/playwhat/core';
import { TheThingFilter } from '@ygg/the-thing/core';
import { AuthenticateService } from '@ygg/shared/user';

@Component({
  selector: 'ygg-my-tour-plan-list',
  templateUrl: './my-tour-plan-list.component.html',
  styleUrls: ['./my-tour-plan-list.component.css']
})
export class MyTourPlanListComponent {
  ImitationTourPlan = ImitationTourPlan;
}
