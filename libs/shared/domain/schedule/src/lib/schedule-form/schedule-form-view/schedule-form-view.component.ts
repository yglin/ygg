import { Component, OnInit, Input } from '@angular/core';
import { ScheduleForm } from '../schedule-form';

@Component({
  selector: 'ygg-schedule-form-view',
  templateUrl: './schedule-form-view.component.html',
  styleUrls: ['./schedule-form-view.component.css']
})
export class ScheduleFormViewComponent implements OnInit {
  @Input() scheduleForm: ScheduleForm;
  
  constructor() { }

  ngOnInit() {
  }

}
