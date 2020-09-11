import { Emcee } from '@ygg/shared/infra/core';
import { CustomPage } from './custom-page';
import { CustomPageAccessor } from './custom-page-accessor';

export abstract class CustomPageFactory {
  constructor(
    protected customPageAccessor: CustomPageAccessor,
    protected emcee: Emcee
  ) {}

  async save(customPage: CustomPage) {
    try {
      const confirm = await this.emcee.confirm(`確定要儲存修改的內容？`);
      if (confirm) {
        await this.customPageAccessor.save(customPage);
        await this.emcee.info(`已儲存修改內容`);
        return;
      }
    } catch (error) {
      const wrapError = new Error(
        `儲存頁面 ${customPage.label} 的修改內容失敗，錯誤原因：\n${error.message}`
      );
      this.emcee.error(wrapError.message);
      return Promise.reject(wrapError);
    }
  }
}
