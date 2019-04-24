import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Resource } from '@ygg/shared/domain/resource';
import { ScheduleFormService } from '../schedule-form/schedule-form.service';

@Component({
  selector: 'ygg-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {
  scheduleFormGroup: FormGroup;
  selectedResourceIds: Set<string>;

  constructor(
    private scheduleFormService: ScheduleFormService
  ) {
    this.scheduleFormGroup = this.scheduleFormService.createFormGroup();
    this.selectedResourceIds = new Set([]);
  }

  ngOnInit() {
  }

  hasResourceSelected(): boolean {
    return this.selectedResourceIds && this.selectedResourceIds.size > 0;
  }

  onSelectResources(resourceIds: Set<string>) {
    this.selectedResourceIds = resourceIds;
  }
}
