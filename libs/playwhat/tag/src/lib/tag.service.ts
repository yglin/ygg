import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Tags } from './tags';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor() { }

  getOptionTags$(taggableType: string): Observable<Tags> {
    // TODO implement
    return of(Tags.forge());
  }
}
