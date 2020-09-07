import {
  animation, trigger, animateChild, group,
  transition, animate, style, query, state
} from '@angular/animations';


export const fadeOutAnimation =
  trigger('fadeOutAnimation', [
    state('show', style({
      opacity: 1.0,
      height: '*'
    })),
    state('hide', style({
      opacity: 0.0,
      height: 0
    })),
    transition('show => hide', [animate('1s 0s ease-out')]),
    transition('hide => show', [animate('100ms')])
  ]);

