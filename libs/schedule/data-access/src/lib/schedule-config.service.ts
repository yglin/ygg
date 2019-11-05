import { Injectable } from '@angular/core';
import { DataAccessService } from '@ygg/shared/infra/data-access';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleConfigService {
  configPath = 'site-config/schedule';

  constructor(private dataAccessService: DataAccessService) { }

  async set(path: string, data: any) {
    const fullPath = `${this.configPath}/${path}`;
    try {
      await this.dataAccessService.setDataObject(fullPath, data);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  get$(path: string): Observable<any> {
    const fullPath = `${this.configPath}/${path}`;
    return this.dataAccessService.getDataObject$<any>(fullPath);
  }
}
