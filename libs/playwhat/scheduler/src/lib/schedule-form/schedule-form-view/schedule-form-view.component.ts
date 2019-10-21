import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ScheduleForm } from '../schedule-form';
import { ActivatedRoute, Router } from '@angular/router';
import { ScheduleFormService } from '../schedule-form.service';
import { Subscription, Observable, merge } from 'rxjs';
import { TranspotationTypes } from '../transpotation';
import { AuthenticateService, User } from '@ygg/shared/user';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'ygg-schedule-form-view',
  templateUrl: './schedule-form-view.component.html',
  styleUrls: ['./schedule-form-view.component.css']
})
export class ScheduleFormViewComponent implements OnInit {
  @Input() scheduleForm: ScheduleForm;
  transpotationTypes = TranspotationTypes;

  constructor() {}

  ngOnInit() {
  }
}
