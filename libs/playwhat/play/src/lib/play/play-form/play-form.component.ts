import { extend, values } from 'lodash';
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Play } from '../play';
import { PlayService } from '../play.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LogService } from '@ygg/shared/infra/log';
import {
  FormControlModel,
  FormGroupModel
  // FormFactoryService
} from '@ygg/shared/ui/dynamic-form';
import { Subscription } from 'rxjs';
import { PlayFactoryService } from '../play-factory.service';
import { AuthenticateService, User } from '@ygg/shared/user';
import { YggDialogService } from '@ygg/shared/ui/widgets';
import { Addition } from '@ygg/resource/core';
import { AdditionEditDialogComponent } from '../addition-edit-dialog/addition-edit-dialog.component';
import { PlayFormGroupModel } from '../play-form-model';

@Component({
  selector: 'ygg-play-form',
  templateUrl: './play-form.component.html',
  styleUrls: ['./play-form.component.css']
})
export class PlayFormComponent implements OnInit, OnDestroy {
  @Input() play: Play;
  @Output() valueChanged: EventEmitter<Play> = new EventEmitter();
  @Output() submit: EventEmitter<Play> = new EventEmitter();
  formModel: FormGroupModel;
  controlModels: FormControlModel[];
  formGroup: FormGroup;
  subscriptions: Subscription[] = [];
  currentUser: User;

  constructor(
    private authenticateService: AuthenticateService,
    private logService: LogService,
    private playService: PlayService,
    private router: Router,
    private route: ActivatedRoute,
    // private formFactory: FormFactoryService,
    private playFactory: PlayFactoryService,
    private yggDialog: YggDialogService
  ) {
    this.formModel = PlayFormGroupModel;
    this.controlModels = values(this.formModel.controls);
    this.formGroup = this.playFactory.createFormGroup();
    this.subscriptions.push(
      this.authenticateService.currentUser$.subscribe(
        user => (this.currentUser = user)
      )
    );
  }

  ngOnInit() {
    if (this.play) {
      // console.log(this.play);
      this.play = this.play.clone();
      this.formGroup.patchValue(this.play);
    }
    this.subscriptions.push(
      this.formGroup.valueChanges.subscribe(value => {
        // console.log(value);
        if (value) {
          extend(this.play, value);
          this.valueChanged.emit(this.play);
        }
      })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  clearAdditions() {
    if (confirm('移除所有的附屬品？')) {
      this.play.additions = [];
    }
  }

  addAddition() {
    const dialogRef = this.yggDialog.open(AdditionEditDialogComponent, {
      title: '新增附屬品'
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe((addition: Addition) => {
      if (addition) {
        this.play.additions.push(addition);
        this.valueChanged.emit(this.play);
      }      
    }));
  }

  editAddition(index: number) {
    const addition = this.play.additions[index];
    const dialogRef = this.yggDialog.open(AdditionEditDialogComponent, {
      title: '修改附屬品',
      data: {
        addition
      }
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe((addition: Addition) => {
      if (addition) {
        this.play.additions[index] = addition;
        this.valueChanged.emit(this.play);
      }      
    }));
  }

  deleteAddition(index: number) {
    this.play.additions.splice(index, 1);
    this.valueChanged.emit(this.play);
  }

  async onSubmit() {
    if (this.formGroup) {
      extend(this.play, this.formGroup.value);
      if (this.currentUser) {
        this.play.creatorId = this.currentUser.id;
      }
      try {
        await this.playService.upsert(this.play);
        alert('新增/修改體驗完成');
        this.submit.emit(this.play);
      } catch (error) {
        alert(`新增/修改體驗失敗，錯誤：${error.message}`);
        // this.logService.error(error);
      }
    }
  }
}
