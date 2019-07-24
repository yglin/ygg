import { extend } from 'lodash';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Play } from '../play';
import { PlayService } from '../play.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LogService } from '@ygg/shared/infra/log';

@Component({
  selector: 'ygg-play-form',
  templateUrl: './play-form.component.html',
  styleUrls: ['./play-form.component.css']
})
export class PlayFormComponent implements OnInit {
  @Input() play: Play;
  formGroup: FormGroup;

  constructor(
    private logService: LogService,
    private formBuilder: FormBuilder,
    private playService: PlayService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formGroup = this.formBuilder.group({
      name: ''
    });
  }

  ngOnInit() {
    if (!this.play) {
      this.play = new Play();
    }
    this.formGroup.patchValue(this.play);
  }

  async onSubmit() {
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
