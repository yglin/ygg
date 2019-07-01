import {isEmpty} from 'lodash';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SchedulerAdminService } from '../scheduler-admin.service';

@Component({
  selector: 'ygg-admin-agent',
  templateUrl: './admin-agent.component.html',
  styleUrls: ['./admin-agent.component.css']
})
export class AdminAgentComponent implements OnInit, OnDestroy {
  title = '接單服務人員';
  agentIds: string[] = [];
  subscriptions: Subscription[] = [];

  constructor(private schedulerAdminService: SchedulerAdminService) {
    this.agentIds = [];
    this.subscriptions.push(
      this.schedulerAdminService.listAgentIds$().subscribe(agentIds => {
        this.agentIds = agentIds;
      })
    );
  }

  ngOnInit() {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onSubmit(selection: string[]) {
    if (!isEmpty(selection) && confirm(`確定要修改${this.title}？`)) {
      this.schedulerAdminService.updateAgents(selection).then(() => {
        alert(`${this.title} 修改完成`);
      });
    }
  }
}
