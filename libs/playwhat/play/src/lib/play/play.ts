import { extend, sample } from 'lodash';
import { v4 as uuid } from 'uuid';
import { DataItem, toJSONDeep } from '@ygg/shared/infra/data-access';
import { FormGroupModel, FormControlModel } from '@ygg/shared/types';

export class Play implements DataItem {
  id: string;
  name: string;

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
    return newOne;
  }

  static getFormModel(): FormGroupModel {
    const controls: { [key: string]: FormControlModel } = {};
    const formMeta = { name: 'play-form', controls };

    const stringFields = [
      { name: 'name', label: '名稱' },
      { name: 'introduction', label: '簡介' }
    ];
    for (const field of stringFields) {
      controls[field.name] = {
        name: field.name,
        type: 'string',
        label: field.label,
        validators: []
      };
    }

    const requiredFields = ['name', 'introduction'];
    for (const key in controls) {
      if (controls.hasOwnProperty(key)) {
        const controlModel = controls[key];
        if (requiredFields.indexOf(key) >= 0) {
          controlModel.validators.push({
            type: 'required'
          });
        }
      }
    }

    return formMeta;
  }

  constructor() {
    this.id = uuid();
  }

  fromJSON(data: any): this {
    extend(this, data);
    return this;
  }

  toJSON(): any {
    const data = toJSONDeep(this);
    return data;
  }
}
