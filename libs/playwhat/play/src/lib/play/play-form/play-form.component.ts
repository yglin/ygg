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
import { Equipment } from '@ygg/resource/core';
import { EquipmentEditDialogComponent } from '../equipment-edit-dialog/equipment-edit-dialog.component';
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

  clearEquipments() {
    if (confirm('移除所有的設備用具？')) {
      this.play.equipments = [];
    }
  }

  addEquipment() {
    const dialogRef = this.yggDialog.open(EquipmentEditDialogComponent, {
      title: '新增設備'
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe((equipment: Equipment) => {
      if (equipment) {
        this.play.equipments.push(equipment);
        this.valueChanged.emit(this.play);
      }      
    }));
  }

  editEquipment(index: number) {
    const equipment = this.play.equipments[index];
    const dialogRef = this.yggDialog.open(EquipmentEditDialogComponent, {
      title: '修改設備',
      data: {
        equipment
      }
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe((equipment: Equipment) => {
      if (equipment) {
        this.play.equipments[index] = equipment;
        this.valueChanged.emit(this.play);
      }      
    }));
  }

  deleteEquipment(index: number) {
    this.play.equipments.splice(index, 1);
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
