import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Treasure } from '@ygg/ourbox/core';
import { get, isEmpty } from 'lodash';
import { Subject, Subscription } from 'rxjs';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ourbox-treasure-edit',
  templateUrl: './treasure-edit.component.html',
  styleUrls: ['./treasure-edit.component.css']
})
export class TreasureEditComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  @Input() value: Treasure;
  hints: any = {
    album: {},
    name: {}
  };
  formGroupStep1: FormGroup;
  formGroupStep2: FormGroup;
  formGroupStep3: FormGroup;
  initStep = 0;
  eventBusNameControl: Subject<any> = new Subject();
  subscription = new Subscription();

  constructor(private formBuilder: FormBuilder) {
    this.formGroupStep1 = this.formBuilder.group({
      album: [null, Validators.required]
    });
    this.formGroupStep2 = this.formBuilder.group({
      name: ['', Validators.required]
    });
    this.formGroupStep3 = this.formBuilder.group({
      location: [null, Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.stepper.selectedIndex = this.initStep;
    this.subscription.add(
      this.stepper.selectionChange.subscribe(
        (change: StepperSelectionEvent) => {
          switch (change.selectedIndex) {
            case 1:
              if (this.formGroupStep2.get('name').invalid) {
                this.eventBusNameControl.next({
                  name: 'hint',
                  data: { type: 'init', message: '寶物的名稱是...？' }
                });
              }
              break;

            default:
              break;
          }
        }
      )
    );
  }

  ngOnInit(): void {
    const album = get(this.value, 'album', null);
    if (!album || isEmpty(album.photos)) {
      this.hints.album.init = '請至少新增一張寶物的照片';
    } else {
      this.formGroupStep1.get('album').setValue(album);
      this.initStep = 1;
    }

    const name = get(this.value, 'name', null);
    const description = get(this.value, 'description', null);

    if (name && description) {
      this.initStep = 2;
    }
  }

  submit() {
    console.log(' Do nothing...')
  }
}
