import { Injectable, Type } from '@angular/core';
import { TheThingEditor } from '@ygg/the-thing/core';
import { TheThingEditorComponent } from './the-thing/the-thing-editor/the-thing-editor.component';
import { get } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class TheThingEditorService {
  editors: { [id: string]: TheThingEditor } = {};

  constructor() {}

  hasEditor(id: string) {
    return id in this.editors;
  }

  addEditor(editor: TheThingEditor) {
    this.editors[editor.id] = editor;
  }

  getComponent(id: string): Type<any> {
    return get(this.editors, `${id}.component`, TheThingEditorComponent) as any;
  }
}
