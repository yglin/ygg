import { TheThing } from './the-thing';
import { Html } from '@ygg/shared/omni-types/core';

export type TheThingStateConfirmMessage =
  | string
  | ((theThing: TheThing) => string);

export interface TheThingState {
  name: string;
  label: string;
  value: number;
  icon?: string;
  requireChangeRecord?: boolean;
  confirmMessage?: TheThingStateConfirmMessage;
  permissions?: string[];
  threadable?: boolean;
}

export interface TheThingStateChangeRecord {
  message: Html;
}

export function stateConfirmMessage(
  theThing: TheThing,
  state: TheThingState
): string {
  if (typeof state.confirmMessage === 'string') {
    return state.confirmMessage;
  } else if (typeof state.confirmMessage === 'function') {
    return state.confirmMessage(theThing);
  } else return `將 ${theThing.name} 的狀態設定為 ${state.name} ？`;
}
