import { FormGroupModel, FormControlType } from '@ygg/shared/ui/dynamic-form';
import { Album, BusinessHours, Location } from '@ygg/shared/types';

export const PlayFormGroupModel: FormGroupModel = {
  name: 'play-form',
  controls: {
    name: {
      name: 'name',
      type: FormControlType.text,
      label: '名稱',
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
    minuteLength: {
      name: 'minuteLength',
      type: FormControlType.number,
      label: '體驗時長(分鐘)',
      default: 30,
      options: {
        min: 30,
        max: 240
      }
    },
    businessHours: {
      name: 'businessHours',
      type: FormControlType.businessHours,
      label: '服務時段',
      default: new BusinessHours()
    },
    location: {
      name: 'location',
      type: FormControlType.location,
      label: '地點',
      default: new Location()
    },
    price: {
      name: 'price',
      type: FormControlType.number,
      label: '單價',
      default: 0
    }
  }
};
