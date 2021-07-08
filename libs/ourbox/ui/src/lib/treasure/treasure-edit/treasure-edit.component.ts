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
import { Treasure, ProvisionType } from '@ygg/ourbox/core';
import { extend, get, isEmpty, values } from 'lodash';
import { Subject, Subscription } from 'rxjs';
import { TreasureFactoryService } from '../treasure-factory.service';

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
  formGroupAlbum: FormGroup;
  formGroupName: FormGroup;
  formGroupTags: FormGroup;
  formGroupProvision: FormGroup;
  // formGroupStep3: FormGroup;
  initStep = 0;
  eventBusNameControl: Subject<any> = new Subject();
  subscription = new Subscription();
  provisions = Treasure.provisionTypes;
  selectedProvision = this.provisions[0];
  isProvisionSale = false;

  constructor(
    private formBuilder: FormBuilder,
    private treasureFactory: TreasureFactoryService
  ) {
    this.formGroupAlbum = this.formBuilder.group({
      album: [null, Validators.required]
    });
    this.formGroupName = this.formBuilder.group({
      name: ['', Validators.required]
    });
    this.formGroupTags = this.formBuilder.group({ tags: null });
    this.formGroupProvision = this.formBuilder.group({
      provision: 0,
      price: 0
    });
    this.subscription.add(
      this.formGroupProvision.get('provision').valueChanges.subscribe(value => {
        if (value) {
          this.isProvisionSale = false;
          this.selectedProvision = new ProvisionType(value);
          if (this.selectedProvision.isEqual(Treasure.provisionTypes[2])) {
            this.isProvisionSale = true;
          }
        } else {
          this.selectedProvision = null;
        }
      })
    );
    // this.formGroupStep3 = this.formBuilder.group({
    //   location: [null, Validators.required]
    // });
    // console.log(this.provisions);
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
              if (this.formGroupName.get('name').invalid) {
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
      this.formGroupAlbum.get('album').setValue(album);
      this.initStep = 1;
    }

    const name = get(this.value, 'name', null);
    const description = get(this.value, 'description', null);

    if (name && description) {
      this.initStep = 2;
    }

    const provisionType: ProvisionType = get(this.value, 'provision', null);
    this.isProvisionSale =
      provisionType && provisionType.isEqual(Treasure.provisionTypes[2]);
    this.formGroupProvision.setValue(
      {
        provision: (provisionType && provisionType.value) || 0,
        price: (this.value && this.value.price) || 0
      },
      { emitEvent: false }
    );
  }

  async submit() {
    const payload = extend(
      {
        provision: this.selectedProvision,
        price: this.formGroupProvision.get('price').value
      },
      this.formGroupAlbum.value,
      this.formGroupName.value,
      this.formGroupTags.value
      // this.formGroupStep3.value
    );
    console.log(payload);
    this.value.update(payload);
    await this.treasureFactory.save(this.value);
  }
}
