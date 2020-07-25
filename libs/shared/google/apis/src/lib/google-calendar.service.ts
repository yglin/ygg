import { Injectable } from '@angular/core';
import { GoogleApiService } from './google-api.service';
import { isEmpty } from "lodash";

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {
  constructor(private googleApi: GoogleApiService) {}

  async loadCalendarApi(): Promise<any> {
    const clientApi = await this.googleApi.loadGoogleApiClient();
    return clientApi.calendar;
  }

  async insertEvent(event: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const calendarApi = await this.loadCalendarApi();
        const request = calendarApi.events.insert({
          calendarId: 'primary',
          resource: event
        });
        request.execute(response => {
          if (!response) {
            reject(new Error(`Http Error: no response, something going wrong...`));
          }
          else if (response.code && response.code !== 200) {
            const errorInfo = response.error;
            if (
              errorInfo.code === 409 &&
              !isEmpty(errorInfo.data) &&
              errorInfo.data[0].reason === 'duplicate'
            ) {
              reject(new Error(`行程已存在Google日曆中`));
            } else {
              reject(new Error(`Http Error: ${JSON.stringify(errorInfo)}`));
            }
          } else {
            resolve(response);
          }
        });
      } catch (error) {
        console.error(error);
        reject(
          new Error(`Failed to insert google calendar event, ${error.message}`)
        );
      }
    });
  }
}
