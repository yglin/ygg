import { FormGroupModel, FormControlType } from '@ygg/shared/ui/dynamic-form';

export const ResourceFormGroupModel: FormGroupModel = {
  name: 'resource-form',
  controls: {
    name: {
      name: 'name',
      type: FormControlType.text,
      label: '名稱',
      validators: [{ type: 'required', errorMessage: '請填入名稱' }]
    },
    album: {
      name: 'album',
      type: FormControlType.album,
      label: '照片'
    }
  }
}