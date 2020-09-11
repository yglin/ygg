import { EntityAccessor, toJSONDeep } from '@ygg/shared/infra/core';
import { Html } from '@ygg/shared/omni-types/core';
import { CustomPage } from './custom-page';

export class CustomPageAccessor extends EntityAccessor<CustomPage> {
  collection = 'custom-pages';
  serializer = (customPage: CustomPage): any => {
    return customPage.toJSON();
  };
  deserializer = (data: any): CustomPage => {
    return new CustomPage(data);
  };
}
