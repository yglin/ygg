import { merge } from 'lodash';
import { Accommodation } from './accommodation';
import { FormGroupModel, FormControlType } from '@ygg/shared/ui/dynamic-form';
import { ResourceFormGroupModel } from '../resource';

export const AccommodationFormGroupModel: FormGroupModel = merge(
  {},
  ResourceFormGroupModel,
  {
    name: 'accommodation-form',
    controls: {
      name: {
        label: '飯店、旅館或民宿名稱'
      },
      introduction: {
        name: 'introduction',
        type: FormControlType.textarea,
        label: '簡介',
        validators: [{ type: 'required', errorMessage: '請填入簡介' }]
      },
      location: {
        name: 'location',
        type: FormControlType.location,
        label: '地址',
      }
    },
    controlsOrder: ['name', 'introduction', 'album', 'location']
  }
);
