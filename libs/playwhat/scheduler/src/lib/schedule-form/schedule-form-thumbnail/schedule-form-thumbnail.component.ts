import { isEmpty } from "lodash";
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ScheduleFormService } from '../schedule-form.service';
import { ScheduleForm } from '../schedule-form';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ygg-schedule-form-thumbnail',
  templateUrl: './schedule-form-thumbnail.component.html',
  styleUrls: ['./schedule-form-thumbnail.component.css']
})
export class ScheduleFormThumbnailComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Output() click: EventEmitter<string> = new EventEmitter();
  scheduleForm: ScheduleForm;
  subscriptions: Subscription[] = [];

  constructor(private scheduleFormService: ScheduleFormService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    if (this.id) {
      this.subscriptions.push(
        this.scheduleFormService
          .get$(this.id)
          .subscribe(form => (this.scheduleForm = form))
      );
    }
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onClick() {
    if (!isEmpty(this.click.observers)) {
      this.click.emit(this.id);
    } else {
      this.router.navigate([this.id], {relativeTo: this.route});
    }
  }
}
