import { extend, sample } from 'lodash';
import { v4 as uuid } from 'uuid';
import { DataItem, toJSONDeep } from '@ygg/shared/infra/data-access';
import {
  FormGroupModel,
  FormControlModel,
  FormControlType
} from '@ygg/shared/types';
import { Album, BusinessHours, Address } from '@ygg/shared/types';

export class Play implements DataItem {
  id: string;
  name: string;
  introduction: string;
  album: Album;
  businessHours: BusinessHours;

  static forge(): Play {
    const newOne = new Play();
    newOne.name = sample([
      '總統府遛鳥',
      '馬里雅納海溝深潛',
      '佔領釣魚台',
      '掛川花鳥園',
      '南極企鵝摔角',
      '大成王功淨灘',
      '野外踏青捉蟬',
      '獨角仙夏令營'
    ]);
    newOne.introduction = sample([
      '地球上提供給我們的物質財富足以滿足每個人的需求，但不足以滿足每個人的貪慾',
      '在這個世界上，你必須成為你希望看到的改變。',
      '要活就要像明天你就會死去一般活著。要學習就要好像你會永遠活著一般學習。',
      '心若改變，態度就會改變,態度改變，習慣就改變；習慣改變，人生就會改變。',
      '我覺得，當心靈發展到了某個階段的時候，我們將不再為了滿足食慾而殘殺動物。'
    ]);
    newOne.album = Album.forge();
    newOne.businessHours = BusinessHours.forge();
    return newOne;
  }

  static getFormModel(): FormGroupModel {
    const controls: { [key: string]: FormControlModel } = {
      name: {
        name: 'name',
        type: FormControlType.text,
        label: '名稱',
        default: 'GGYY', // XXX For debug
        validators: [
          {
            type: 'required',
            errorMessage: '請填入名稱'
          }
        ]
      },
      introduction: {
        name: 'introduction',
        type: FormControlType.textarea,
        label: '簡介',
        default: 'GGYY love', // XXX For debug
        validators: [
          {
            type: 'required',
            errorMessage: '請填入簡介'
          }
        ]
      },
      album: {
        name: 'album',
        type: FormControlType.album,
        label: '相簿',
        default: new Album()
      },
      businessHours: {
        name: 'businessHours',
        type: FormControlType.businessHours,
        label: '服務時段',
        default: new BusinessHours()
      },
      address: {
        name: 'address',
        type: FormControlType.address,
        label: '地址',
        default: new Address()
      }
    };

    const formModel = { name: 'play-form', controls };
    return formModel;
  }

  constructor() {
    this.id = uuid();
  }

  fromJSON(data: any): this {
    extend(this, data);
    if (data.album) {
      this.album = new Album().fromJSON(data.album);
    }
    if (data.businessHours) {
      this.businessHours = new BusinessHours().fromJSON(data.businessHours);
    }
    return this;
  }

  toJSON(): any {
    const data = toJSONDeep(this);
    return data;
  }
}
