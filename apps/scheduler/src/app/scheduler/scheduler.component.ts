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
  selectedResources: Resource[];

  constructor(
    private scheduleFormService: ScheduleFormService
  ) {
    this.scheduleFormGroup = this.scheduleFormService.createFormGroup();
    this.selectedResources = [];
  }

  ngOnInit() {
  }

  onSelectResource(resourceIds: string[]) {
    console.log('Selected resources: ');
    console.log(resourceIds);
  }
}
