import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Box } from '@ygg/ourbox/core';
import { wrapError } from '@ygg/shared/infra/error';
import { Album, Image } from '@ygg/shared/omni-types/core';
import { ImageUploaderService } from '@ygg/shared/omni-types/ui';
import { EmceeService } from '@ygg/shared/ui/widgets';
import { isEmpty } from 'lodash';
import { Subscription } from 'rxjs';
import { BoxFactoryService } from '../box-factory.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ourbox-box-create',
  templateUrl: './box-create.component.html',
  styleUrls: ['./box-create.component.css']
})
export class BoxCreateComponent implements OnInit, OnDestroy {
  firstFormGroup: FormGroup;
  formGroupLocation: FormGroup;
  // secondFormGroup: FormGroup;
  // formControlMemberEmail: FormControl = new FormControl('', [Validators.email]);
  formControlMemberEmails: FormControl = new FormControl([]);
  formControlPublic: FormControl = new FormControl(false);
  // members: { [email: string]: { id: string } } = {};
  // foundUsers: User[] = [];
  // isEmail = isEmail;
  isPublicDescription = '';
  subscription: Subscription = new Subscription();
  thumbnailImages = Box.sampleImages;
  thumbSelected = '/assets/images/box/box.png';
  flagIsPublic = {
    id: 'isPublic',
    label: '公開',
    description:
      '<h3>公開寶箱內的寶物會顯示在公開搜尋結果中，例如藏寶圖以及寶物倉庫</h3><h3>非公開寶箱內的寶物，只有寶箱成員能看得到</h3>'
  };

  constructor(
    private formBuilder: FormBuilder,
    private boxFactory: BoxFactoryService,
    private imageUploader: ImageUploaderService,
    private emcee: EmceeService
  ) {
    this.firstFormGroup = this.formBuilder.group({
      name: [null, Validators.required]
    });
    this.formGroupLocation = this.formBuilder.group({
      location: [null, Validators.required]
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }

  async submit() {
    const box = this.boxFactory.create();
    box.name = this.firstFormGroup.get('name').value;
    const boxThumb = new Image(this.thumbSelected);
    box.album = new Album({
      cover: boxThumb,
      photos: [boxThumb]
    });
    box.location = this.formGroupLocation.get('location').value;
    box.public = this.formControlPublic.value;
    await box.save();
  }

  async addImages() {
    const images: Image[] = await this.imageUploader.uploadImages();
    if (!isEmpty(images)) {
      this.thumbnailImages.push.apply(
        this.thumbnailImages,
        images.map(img => img.src)
      );
    }
  }
}
