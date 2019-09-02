import { extend, values } from 'lodash';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Play } from '../play';
import { PlayService } from '../play.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LogService } from '@ygg/shared/infra/log';
import {
  FormControlModel,
  FormGroupModel
  // FormFactoryService
} from '@ygg/shared/types';
import { Subscription } from 'rxjs';
import { PlayFactoryService } from '../play-factory.service';

@Component({
  selector: 'ygg-play-form',
  templateUrl: './play-form.component.html',
  styleUrls: ['./play-form.component.css']
})
export class PlayFormComponent implements OnInit, OnDestroy {
  @Input() play: Play;
  formModel: FormGroupModel;
  controlModels: FormControlModel[];
  formGroup: FormGroup;
  subscriptions: Subscription[] = [];

  constructor(
    private logService: LogService,
    private playService: PlayService,
    private router: Router,
    private route: ActivatedRoute,
    // private formFactory: FormFactoryService,
    private playFactory: PlayFactoryService
  ) {
    this.formModel = this.playFactory.createModel();
    this.controlModels = values(this.formModel.controls);
    this.formGroup = this.playFactory.createFormGroup();
  }

  ngOnInit() {
    if (this.play) {
      this.formGroup.patchValue(this.play);
    } else {
      this.play = new Play();
    }
    this.subscriptions.push(
      this.formGroup.valueChanges.subscribe(value => {
        console.log(value);
        if (value) {
          extend(this.play, value);
        }
      })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  async onSubmit() {
    if (this.formGroup) {
      extend(this.play, this.formGroup.value);
      try {
        await this.playService.upsert(this.play);
        alert('新增體驗完成');
        this.router.navigate([this.play.id], { relativeTo: this.route.parent });
      } catch (error) {
        alert('新增體驗失敗');
        this.logService.error(error);
      }
    }
  }
}
