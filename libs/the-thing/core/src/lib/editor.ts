import { TheThing } from './the-thing';

export interface ITheThingEditorComponent {
  theThing: TheThing;
}

export interface TheThingEditor {
  id: string;
  label: string;
  component?: any;
}