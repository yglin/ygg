import { ImitationTourPlan } from '@ygg/playwhat/core';
import { TheThing } from '@ygg/the-thing/core';
import { User } from 'firebase';
import { mapValues } from 'lodash';

export function forgeTourPlansByState(): { [index: string]: TheThing } {
  const tourPlansByState = mapValues(ImitationTourPlan.states, state => {
    const tourPlanByState = ImitationTourPlan.forgeTheThing();
    tourPlanByState.name = `測試遊程狀態：${state.label}_${Date.now()}`;
    ImitationTourPlan.setState(tourPlanByState, state);
    return tourPlanByState;
  });
  return tourPlansByState;
}
